import { Inject, Injectable } from "@angular/core";
import { map, tap } from "rxjs";
import { SERVER_LIST } from "../contract/server-list-store.token";
import { ServerListStore } from "../contract/server-list-store.type";
import { SERVER_DETAIL } from "../contract/server-detail-store.token";
import { ServerDetailStore } from "../contract/server-detail-store.type";
import { ServerRemoveAdapter } from "@server/infrastructure/gateway/adapter/server-remove.adapter";
import { ServerRemoveUseCase } from "@server/application/use-case/server-remove.use-case";

@Injectable()
export class ServerRemoveHandler {

  public constructor(
    private readonly remove: ServerRemoveAdapter,
    @Inject(SERVER_LIST) private readonly listStore: ServerListStore,
    @Inject(SERVER_DETAIL) private readonly detailStore: ServerDetailStore
  ) {
  }

  public handle(useCase: ServerRemoveUseCase) {
    return this.remove.handle(useCase)
      .pipe(
        tap(serverId => {
          this.detailStore.remove(
             useCase.id.toString()
          )
        }),
        tap(serverId => {
          const newList = [...this.listStore.value().filter(id => id !== useCase.id)];
          this.listStore.set(newList)
        }),
        map(() => null)
      );
  }
}
