import { ModuleWithProviders, NgModule } from "@angular/core";
import { SOCKET_IO_CONTROLLER } from "./application/contract/controller.token";
import { SocketIoGateway } from "./infrastructure/socket-io.gateway";
import { HISTORY_STORE_LIST } from "./application/contract/history-store-list.token";
import { HistoryStore } from "./application/contract/history-store-list.type";
import { InMemoryStore, ObservableStore, SingleValueStore } from "@shared-kernel/store";
import { HISTORY_DETAIL_STORE } from "@shared-kernel/socket-io/application/contract/history-store-detail.token";
import { HistoryDetailStore } from "@shared-kernel/socket-io/application/contract/history-store-detail.type";
import { HistoryRecord } from "@shared-kernel/socket-io/application/contract/history-message.interface";


@NgModule()
export class SharedSocketIoModule {
  public static forRoot(): ModuleWithProviders<SharedSocketIoModule> {
    return ({
      ngModule: SharedSocketIoModule,
      providers: [
        {
          provide: HISTORY_STORE_LIST, useFactory: (): HistoryStore => {
            return new SingleValueStore(
              new ObservableStore(
                new InMemoryStore()
              ),
              []
            )
          }
        },
        {
          provide: HISTORY_DETAIL_STORE, useFactory: (): HistoryDetailStore => {
            return new ObservableStore<HistoryRecord>(
              new InMemoryStore()
            )
          }
        },
        {
          provide: SOCKET_IO_CONTROLLER,
          useClass: SocketIoGateway,
          deps: [HISTORY_STORE_LIST, HISTORY_DETAIL_STORE]
        },
      ]
    })
  }
}
