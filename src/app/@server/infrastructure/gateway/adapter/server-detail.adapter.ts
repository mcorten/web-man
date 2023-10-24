import {Inject, Injectable} from "@angular/core";
import {Database, DATABASE} from "@shared-kernel/database";
import {ServerDetailUseCase} from "../../../application/use-case/server-detail.use-case";

@Injectable()
export class ServerDetailAdapter {
  public constructor(@Inject(DATABASE) private readonly storage: Database) {
  }

  public handle(useCase: ServerDetailUseCase) {
    return this.storage.servers().get(useCase.id)
  }
}
