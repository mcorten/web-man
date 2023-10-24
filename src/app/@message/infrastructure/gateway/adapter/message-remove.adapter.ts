import { Inject, Injectable } from "@angular/core";
import { Database, DATABASE } from "@shared-kernel/database";
import { ServerRemoveUseCase } from "@server/application/use-case/server-remove.use-case";
import { WantsToRemoveMessage } from "@message/application/use-case/wants-to-remove-message.use-case";

@Injectable()
export class MessageRemoveAdapter {
  public constructor(@Inject(DATABASE) private readonly storage: Database) {
  }

  public handle(useCase: WantsToRemoveMessage) {
    return this.storage.messages().remove({id: useCase.id})
  }
}
