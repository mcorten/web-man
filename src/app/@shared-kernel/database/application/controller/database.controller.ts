import Dexie, {Table} from "dexie";
import {defer, from, map, Observable, of, switchMap} from "rxjs";
import {Server, ServerCreate} from "../contract/table/server.table";
import {Message, MessageCreate} from "@shared-kernel/database";
import {Md5} from "ts-md5";
import {Label, LabelCreate} from "../contract/table/label.table";
import {PeerServer, PeerServerCreate} from "../contract/table/peer-servers.table";


export class Database extends Dexie {
  private _servers!: Table<ServerCreate, number>;
  private _messages!: Table<MessageCreate, number>;
  private _labels!: Table<LabelCreate, number>;
  private _peerServers!: Table<PeerServerCreate, number>;

  public constructor() {
    super('MyDatabase');

    this.version(1).stores({
      servers: '++id, host',
      messages: '++id, hash'
    });
    this.version(2).stores({
      servers: '++id, host, lastUsed',
    });
    this.version(3).stores({
      messages: '++id, name'
    }).upgrade(trans => {
      return trans.table("messages").toCollection().modify((message: Message) => {
        message.name = message.event
      })
    });
    this.version(4).stores({
      labels: '++id, name'
    });
    this.version(5).stores({}).upgrade(trans => {
      return trans.table("messages").toCollection().modify((message: Message) => {
        message.labels = []
      })
    });
    this.version(6).stores({
      'peer-servers': '++id,  turn, user'
    })
    this.version(7).stores({
      servers: '++id, host, name, options',
    }).upgrade(trans => {
      return trans.table("servers").toCollection().modify((server: Server) => {
        server.options = { "auth.token": '' }
      })
    });

    this._servers = this.table('servers');
    this._messages = this.table('messages');
    this._labels = this.table('labels');
    this._peerServers = this.table('peer-servers');

    this.open();
  }

  public labels() {
    const isLabel = (a: unknown): a is Label => {
      if (a === null) {
        return false;
      }

      if (!(typeof a === 'object')) {
        return false;
      }

      return true;
    }

    return {
      add: (label: LabelCreate): Observable<number> => {
        // TODO find if it does not exist already
        return defer(() => from(
          this._labels.add(label)
        ))
      },
      findOne: (contract: Partial<Label>): Observable<Label | undefined> => {
        const where: { [key: string]: any } = {}
        if (contract.id) {
          where['id'] = contract.id
        }
        if (contract.name) {
          where['name'] = contract.name
        }

        return defer(() => from(
            this._labels
              .where(where)
              .first()
          )
            .pipe(map(maybeLabel => {
              if (isLabel(maybeLabel)) {
                return maybeLabel;
              }

              return undefined;
            }))
        )
      },

      list: (): Observable<Label[]> => {
        return defer(() => from(
            this._labels.toArray()
          ).pipe(
            map(
              labels => {
                return labels.reduce((l, a) => {
                  if (isLabel(a)) {
                    l.push(a);
                  }

                  return l;
                }, [] as Label[]);

              })
          )
        )
      },
    }
  }

  public peerServers() {
    return {
      add: (peerServer: PeerServerCreate): Observable<number> => {
        return defer(() => from(
          this._peerServers.add(peerServer)
        ))
      },
      list: (): Observable<PeerServer[]> => {
        return defer(() => from(
          this._peerServers.toArray()
        )).pipe(
          map(messageCollection =>
            messageCollection.filter((m): m is PeerServer => true)
          )
        )
      },
    }
  }


  public servers() {
    return {
      add: (server: ServerCreate): Observable<number> => {
        return defer(() => from(
          this._servers.add(server)
        ))
      },
      list: (): Observable<ServerCreate[]> => {
        return defer(() => from(
          this._servers.toArray())
        )
      },
      get: (id: number): Observable<ServerCreate> => {
        return this.servers().findOne({id})
          .pipe(
            map(server => {
              if (server === undefined) {
                throw new Error(`Server with id [${id}] not found`)
              }

              return server;
            })
          )
      },
      findOne: (contract: Partial<Pick<ServerCreate, 'id' | 'host'>>): Observable<ServerCreate | undefined> => {
        const where: { [key: string]: any } = {}
        if (contract.id) {
          where['id'] = contract.id
        }
        if (contract.host) {
          where['host'] = contract.host
        }

        return defer(() => from(
            this._servers
              .where(where)
              .first()
          )
        )
      },
      remove: (contract: Pick<Server, 'id'>) => {
        return defer(
          () => from(
            this._servers.delete(contract.id)
          )
        )
      }
    }
  }

  public messages() {
    return {
      addIfNotExists: (message: Pick<MessageCreate, 'event' | 'body' | 'name' | 'labels'>) => {
        return defer(() => {
          return this.messages().findOne({name: message.name})
            .pipe(
              switchMap(r => {
                if (r === undefined) {
                  return this.messages().add({
                    ...message
                  })
                }

                return of(null)
              })
            )
        })
      },
      add: (message: Pick<MessageCreate, 'event' | 'body' | 'name' | 'labels'> & Partial<Pick<MessageCreate, 'hash'>>): Observable<number> => {
        return from(this._messages.add({
          ...message,
          hash: message.hash ?? Md5.hashStr(message.body)
        }))
      },
      get: (id: number): Observable<Message> => {
        return this.messages().findOne({id})
          .pipe(
            map(server => {
              if (server === undefined) {
                throw new Error(`Server with id [${id}] not found`)
              }

              return server as Message;
            })
          )
      },
      label: () => ({
        add: (messageId: number, label: Label): Observable<boolean> => {
          return this.messages().get(messageId)
            .pipe(
              switchMap(message => {
                const foundLabel = message.labels.find(messageContainsLabel => messageContainsLabel.id === label.id);

                if (foundLabel === undefined) {
                  return this._messages.update(message, {
                    labels: message.labels.concat([{id: label.id}])
                  });
                }

                return of(0); // message already contains label
              }),
              map(affectedRows => affectedRows > 0)
            )
        },
        remove: (messageId: number, label: Label): Observable<null> => {
          return this.messages().get(messageId)
            .pipe(
              switchMap(message => {
                let filteredLabels = message.labels.filter(_label => _label.id !== label.id)

                return this._messages.update(messageId, {
                  labels: filteredLabels
                })
              }),
              map(affectedRows => null)
            )
        }
      }),
      list: (): Observable<Message[]> => {
        return defer(() => from(
            this._messages.toArray()
          ).pipe(
            map(messageCollection =>
              messageCollection.filter((m): m is Message => true)
            )
          )
        )
      },
      findOne: (contract: Partial<Pick<Message, 'id' | 'name'>>): Observable<MessageCreate | undefined> => {
        const where: { [key: string]: any } = {}
        if (contract.id) {
          where['id'] = contract.id
        }
        if (contract.name) {
          where['name'] = contract.name
        }

        return defer(() => from(
            this._messages
              .where(where)
              .first()
          )
        )
      },
      remove: (contract: Pick<Message, 'id'>) => {
        return defer(
          () => from(
            this._messages.delete(contract.id)
          )
        )
      },
      update: (contract: Omit<Message, 'hash'>) => {
        return defer(() => from(
            this.messages().findOne({id: contract.id})
              .pipe(
                switchMap((maybeMessage) => {
                  if (maybeMessage === undefined) {
                    throw new Error(`Message with id [${contract.id}] not found`)
                  }

                  const message = maybeMessage as Message;

                  return this._messages.update(message.id, {
                    name: contract.name,
                    event: contract.event,
                    hash: Md5.hashStr(contract.body),
                    body: contract.body
                  }).then(affected => {
                    return affected === 1;
                  });
                })
              )
          )
        )
      }
    }
  }
}
