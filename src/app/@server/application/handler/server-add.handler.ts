import {Inject, Injectable} from "@angular/core";
import {ServerAddUseCase} from "../use-case/server-add.use-case";
import {ServerAddAdapter} from "../../infrastructure/gateway/adapter/server-add.adapter";
import {map, tap} from "rxjs";
import {SERVER_LIST} from "../contract/server-list-store.token";
import {ServerListStore} from "../contract/server-list-store.type";
import {SERVER_DETAIL} from "../contract/server-detail-store.token";
import {ServerDetailStore} from "../contract/server-detail-store.type";

@Injectable()
export class ServerAddHandler {

  public constructor(
    private readonly add: ServerAddAdapter,
    @Inject(SERVER_LIST) private readonly listStore: ServerListStore,
    @Inject(SERVER_DETAIL) private readonly detailStore: ServerDetailStore
  ) {
  }

  public handle(useCase: ServerAddUseCase) {
    return this.add.handle(useCase)
      .pipe(
        tap(serverId => {
          this.detailStore.set({
              id: serverId,
              host: useCase.host,
              name: useCase.name,
              options: useCase.options
            },
            serverId.toString()
          )
        }),
        tap(serverId => {
          this.listStore.set(
            this.listStore.value().concat(
              [serverId]
            )
          )
        }),
        map(() => null)
      );
  }
}
