import {Inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ServerDetailUseCase} from "../use-case/server-detail.use-case";
import {ServerCreate} from "@shared-kernel/database";
import {ServerDetailAdapter} from "../../infrastructure/gateway/adapter/server-detail.adapter";
import {SERVER_DETAIL} from "../contract/server-detail-store.token";
import {ServerDetailStore} from "../contract/server-detail-store.type";

@Injectable()
export class ServerDetailHandler {

  public constructor(
    private readonly detail: ServerDetailAdapter,
    @Inject(SERVER_DETAIL) private readonly detailStore: ServerDetailStore
  ) {
  }

  public handle(useCase: ServerDetailUseCase): Observable<ServerCreate> {
    return this.detailStore.get(useCase.id.toString());
  }
}
