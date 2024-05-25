import { Inject, Injectable } from "@angular/core";
import { Database, DATABASE } from "@shared-kernel/database";
import { ServerAddUseCase } from "../../../application/use-case/server-add.use-case";

@Injectable()
export class ServerAddAdapter {
  public constructor(@Inject(DATABASE) private readonly storage: Database) {
  }

  public handle(useCase: ServerAddUseCase) {
    return this.storage.servers().add({
      name: useCase.name,
      host: useCase.host,
      options: useCase.options
    })
  }
}
