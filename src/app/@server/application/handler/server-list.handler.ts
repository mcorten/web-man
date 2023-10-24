import {Inject, Injectable} from "@angular/core";
import {ServerListAdapter} from "../../infrastructure/gateway/adapter/server-list.adapter";
import {filter, map, Observable, switchMap, tap} from "rxjs";
import {SERVER_LIST} from "../contract/server-list-store.token";
import {ServerListStore} from "../contract/server-list-store.type";
import {SERVER_DETAIL} from "../contract/server-detail-store.token";
import {ServerDetailStore} from "../contract/server-detail-store.type";
import {Server, ServerCreate} from "@shared-kernel/database";


@Injectable()
export class ServerListHandler {

  public constructor(
    private readonly list: ServerListAdapter,
    @Inject(SERVER_LIST) private readonly listStore: ServerListStore,
    @Inject(SERVER_DETAIL) private readonly detailStore: ServerDetailStore
  ) {
  }

  public handle(): Observable<number[]> {
    return this.list.handle()
      .pipe(
        map<Array<ServerCreate>, Array<Server>>(serverCollection => {
          return serverCollection.filter((server): server is Server => typeof server.id === 'number')
        }),
        tap(serverCollection => {
          serverCollection.forEach(server => {
            this.detailStore.set(server, server.id.toString())
          })
        }),
        map(serverCollection => serverCollection
          .map(server => server.id)
        ),
        tap(serverIdCollection => this.listStore.set(serverIdCollection)),
        switchMap(() => this.listStore.get()),
      )
      ;
  }
}
