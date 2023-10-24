import { Inject, Injectable } from "@angular/core";
import { Database, DATABASE } from "@shared-kernel/database";
import { ServerRemoveUseCase } from "@server/application/use-case/server-remove.use-case";

@Injectable()
export class ServerRemoveAdapter {
  public constructor(@Inject(DATABASE) private readonly storage: Database) {
  }

  public handle(useCase: ServerRemoveUseCase) {
    return this.storage.servers().remove({id: useCase.id})
  }
}
