import { WantsToRemoveMessage } from "../use-case/wants-to-remove-message.use-case";
import { Inject, Injectable } from "@angular/core";
import { MessageAddAdapter } from "@message/infrastructure/gateway/adapter/message-add.adapter";
import { WantsToAddMessage } from "@message/application/use-case/wants-to-add-message.use-case";
import { MESSAGE_LIST } from "@message/application/contract/message-list-store.token";
import { MessageListStore } from "@message/application/contract/message-list-store.type";
import { tap } from "rxjs";

@Injectable()
export class MessageAddHandler {

  public constructor(
    private readonly add: MessageAddAdapter,
    @Inject(MESSAGE_LIST) private readonly store: MessageListStore
  ) {
  }

  public handle(useCase: WantsToAddMessage) {
    return this.add.handle(useCase)
      .pipe(
        tap(messageId => {
          if (messageId === null) {
            return;
          }

          this.store.set(
            this.store.value().concat([{
              id: messageId,
              name: useCase.message.name,
              event: useCase.message.event,
              body: useCase.message.body
            }])
          )
        })
      );
  }
}
