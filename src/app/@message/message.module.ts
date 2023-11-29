import { NgModule } from "@angular/core";
import { MessageRemoveAdapter } from "./infrastructure/gateway/adapter/message-remove.adapter";
import { MessageRemoveHandler } from "./application/handler/message-remove.handler";
import { InMemoryStore, ObservableStore, SingleValueStore } from "@shared-kernel/store";
import { Observable } from "rxjs";
import { MESSAGE_LIST } from "./application/contract/message-list-store.token";
import { MessageAddAdapter } from "./infrastructure/gateway/adapter/message-add.adapter";
import { MessageAddHandler } from "./application/handler/message-add.handler";
import { MessageListAdapter } from "./infrastructure/gateway/adapter/message-list.adapter";
import { MessageListHandler } from "./application/handler/message-list.handler";
import { MessageUpdateAdapter } from "./infrastructure/gateway/adapter/message-update.adapter";
import { MessageUpdateHandler } from "@message/application/handler/message-update.handler";

@NgModule({
  providers: [
    MessageAddAdapter,
    MessageAddHandler,

    MessageListAdapter,
    MessageListHandler,

    MessageRemoveAdapter,
    MessageRemoveHandler,

    MessageUpdateAdapter,
    MessageUpdateHandler,

    {
      provide: MESSAGE_LIST,
      useFactory: () => {
        return new SingleValueStore<number[], Observable<number[]>>(
          new ObservableStore(
            new InMemoryStore()
          ),
          []
        )
      }
    },
  ]
})
export class MessageModule {

}
