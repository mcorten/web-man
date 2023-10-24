import { WantsToRemoveMessage } from "../use-case/wants-to-remove-message.use-case";
import { MessageRemoveAdapter } from "@message/infrastructure/gateway/adapter/message-remove.adapter";
import { Inject, Injectable } from "@angular/core";
import { tap } from "rxjs";
import { MESSAGE_LIST } from "@message/application/contract/message-list-store.token";
import { MessageListStore } from "@message/application/contract/message-list-store.type";

@Injectable()
export class MessageRemoveHandler {

  public constructor(
    private readonly remove: MessageRemoveAdapter,
    @Inject(MESSAGE_LIST) private readonly store: MessageListStore
  ) {
  }

  public handle(useCase: WantsToRemoveMessage) {
    return this.remove.handle(useCase).pipe(
      tap(messageId => {
        const filteredContent = this.store.value()
          .filter(item => item.id !== useCase.id)

        this.store.set(filteredContent)
      })
    );
  }
}
