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
import { MessageAddLabelAdapter } from "@message/infrastructure/gateway/adapter/message-add-label.adapter";
import { MessageAddLabelHandler } from "@message/application/handler/message-add-label.handler";
import { LabelModule } from "@label/index";
import { MessageRemoveLabelAdapter } from "@message/infrastructure/gateway/adapter/message-remove-label.adapter";
import { MessageRemoveLabelHandler } from "@message/application/handler/message-remove-label.handler";

@NgModule({
  imports: [
    LabelModule
  ],
  providers: [
    MessageAddAdapter,
    MessageAddHandler,

    MessageListAdapter,
    MessageListHandler,

    MessageRemoveAdapter,
    MessageRemoveHandler,

    MessageUpdateAdapter,
    MessageUpdateHandler,

    MessageAddLabelHandler,
    MessageAddLabelAdapter,

    MessageRemoveLabelHandler,
    MessageRemoveLabelAdapter,

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
