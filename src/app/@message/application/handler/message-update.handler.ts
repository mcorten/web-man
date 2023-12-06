import { WantsToRemoveMessage } from "../use-case/wants-to-remove-message.use-case";
import { Inject, Injectable } from "@angular/core";
import { MessageAddAdapter } from "@message/infrastructure/gateway/adapter/message-add.adapter";
import { WantsToAddMessage } from "@message/application/use-case/wants-to-add-message.use-case";
import { MESSAGE_LIST } from "@message/application/contract/message-list-store.token";
import { MessageListStore } from "@message/application/contract/message-list-store.type";
import { tap } from "rxjs";
import { WantsToUpdateMessage } from "@message/application/use-case/wants-to-update-message.use-case";
import { MessageUpdateAdapter } from "@message/infrastructure/gateway/adapter/message-update.adapter";

@Injectable()
export class MessageUpdateHandler {

  public constructor(
    private readonly update: MessageUpdateAdapter,
    @Inject(MESSAGE_LIST) private readonly store: MessageListStore
  ) {
  }

  public handle(useCase: WantsToUpdateMessage) {
    return this.update.handle(useCase)
      .pipe(
        tap((success) => {
          if (!success) {
            return;
          }

          const updatedContent = this.store.value()
            .map(v => {
              if (useCase.message.id === v.id) {
                return {
                  ...v,
                  name: useCase.message.name,
                  event: useCase.message.event,
                  body: useCase.message.body
                }
              }

              return v;
            })

          this.store.set(updatedContent)
        })
      );
  }
}
