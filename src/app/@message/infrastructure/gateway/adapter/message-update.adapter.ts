import { Inject, Injectable } from "@angular/core";
import { Database, DATABASE } from "@shared-kernel/database";
import { WantsToRemoveMessage } from "@message/application/use-case/wants-to-remove-message.use-case";
import { WantsToAddMessage } from "@message/application/use-case/wants-to-add-message.use-case";
import { WantsToUpdateMessage } from "@message/application/use-case/wants-to-update-message.use-case";

@Injectable()
export class MessageUpdateAdapter {
  public constructor(@Inject(DATABASE) private readonly storage: Database) {
  }

  public handle(useCase: WantsToUpdateMessage) {
    return this.storage.messages().update(useCase.message)
  }
}
