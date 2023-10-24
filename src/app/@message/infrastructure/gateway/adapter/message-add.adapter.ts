import { Inject, Injectable } from "@angular/core";
import { Database, DATABASE } from "@shared-kernel/database";
import { WantsToRemoveMessage } from "@message/application/use-case/wants-to-remove-message.use-case";
import { WantsToAddMessage } from "@message/application/use-case/wants-to-add-message.use-case";

@Injectable()
export class MessageAddAdapter {
  public constructor(@Inject(DATABASE) private readonly storage: Database) {
  }

  public handle(useCase: WantsToAddMessage) {
    return this.storage.messages().addIfNotExists(useCase.message)
  }
}
