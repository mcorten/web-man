import { Inject, Injectable } from "@angular/core";
import { switchMap, tap } from "rxjs";
import { MESSAGE_LIST } from "@message/application/contract/message-list-store.token";
import { MessageListStore } from "@message/application/contract/message-list-store.type";
import { MessageListAdapter } from "@message/infrastructure/gateway/adapter/message-list.adapter";

@Injectable()
export class MessageListHandler {
  public constructor(
    private readonly list: MessageListAdapter,
    @Inject(MESSAGE_LIST) private readonly store: MessageListStore
  ) {
  }

  public handle() {
    return this.list.handle().pipe(
      tap(messages => {
        /**
         * For now, we only update the cache the first time
         * Other calls that make changes to messages, should also update the cache themselves
         *
         * Done for performance, if not we get a lot of cache update triggers where nothing changed
         * Because list messages is used multiple times
         */
        if (this.store.value().length === 0) {
          this.store.set(messages)
        }
      }),
      switchMap(() => this.store.get())
    );
  }
}
