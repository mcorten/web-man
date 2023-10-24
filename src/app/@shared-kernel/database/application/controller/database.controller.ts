import Dexie, {Table} from "dexie";
import { defer, filter, from, map, Observable, of, switchMap, tap } from "rxjs";
import { Server, ServerCreate } from "../contract/table/server.table";
import { Message, MessageCreate } from "@shared-kernel/database";
import {Md5} from "ts-md5";


export class Database extends Dexie {
  private _servers!: Table<ServerCreate, number>;
  private _messages!: Table<MessageCreate, number>;

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
    }).upgrade (trans => {
      return trans.table("messages").toCollection().modify ((message: Message) => {
        message.name = message.event
      })
    });



    this._servers = this.table('servers');
    this._messages = this.table('messages');

    this.open();
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
        const where: {[key: string]: any} = {}
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
      addIfNotExists: (message: Pick<MessageCreate, 'event' | 'body' | 'name'>) => {
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
      add: (message: Pick<MessageCreate, 'event' | 'body' | 'name'> & Partial<Pick<MessageCreate, 'hash'>>): Observable<number> => {
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
        const where: {[key: string]: any} = {}
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
      }
    }
  }
}
