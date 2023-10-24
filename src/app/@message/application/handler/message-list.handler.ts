import { WantsToRemoveMessage } from "../use-case/wants-to-remove-message.use-case";
import { MessageRemoveAdapter } from "@message/infrastructure/gateway/adapter/message-remove.adapter";
import { Inject, Injectable } from "@angular/core";
import { map, switchMap, tap } from "rxjs";
import { MESSAGE_LIST } from "@message/application/contract/message-list-store.token";
import { MessageListStore } from "@message/application/contract/message-list-store.type";
import { MessageListAdapter } from "@message/infrastructure/gateway/adapter/message-list.adapter";

@Injectable()
export class MessageListHandler {

  public constructor(
    private readonly remove: MessageListAdapter,
    @Inject(MESSAGE_LIST) private readonly store: MessageListStore
  ) {
  }

  public handle() {
    return this.remove.handle().pipe(
      tap(messages => {
        this.store.set(messages)
      }),
      switchMap(() => this.store.get())
    );
  }
}
