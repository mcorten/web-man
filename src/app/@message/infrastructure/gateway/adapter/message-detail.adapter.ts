import { Inject, Injectable } from "@angular/core";
import { Database, DATABASE } from "@shared-kernel/database";
import { WantsToKnowMessageDetail } from "@message/application/use-case/wants-to-know-message-detail.use-case";

@Injectable()
export class MessageDetailAdapter {
  public constructor(@Inject(DATABASE) private readonly storage: Database) {
  }

  public handle(useCase: WantsToKnowMessageDetail) {
    return this.storage.messages().get(useCase.id)
  }
}
