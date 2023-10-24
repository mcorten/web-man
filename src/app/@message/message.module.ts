import { NgModule } from "@angular/core";
import { MessageRemoveAdapter } from "@message/infrastructure/gateway/adapter/message-remove.adapter";
import { MessageRemoveHandler } from "@message/application/handler/message-remove.handler";
import { InMemoryStore, ObservableStore, SingleValueStore } from "@shared-kernel/store";
import { Observable } from "rxjs";
import { MESSAGE_LIST } from "./application/contract/message-list-store.token";
import { MessageAddAdapter } from "./infrastructure/gateway/adapter/message-add.adapter";
import { MessageAddHandler } from "./application/handler/message-add.handler";
import { MessageListAdapter } from "@message/infrastructure/gateway/adapter/message-list.adapter";
import { MessageListHandler } from "@message/application/handler/message-list.handler";

@NgModule({
  providers: [
    MessageAddAdapter,
    MessageAddHandler,

    MessageListAdapter,
    MessageListHandler,

    MessageRemoveAdapter,
    MessageRemoveHandler,

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
