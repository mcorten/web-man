import {ModuleWithProviders, NgModule} from "@angular/core";
import {SOCKET_IO_CONTROLLER} from "./application/contract/controller.token";
import {SocketIoGateway} from "./infrastructure/socket-io.gateway";
import {HISTORY_STORE} from "./application/contract/history-store.token";
import {HistoryStore} from "./application/contract/history-store.type";
import {InMemoryStore, ObservableStore, SingleValueStore} from "@shared-kernel/store";
import {Observable} from "rxjs";
import {HistoryMessage} from "./application/contract/history-message.interface";


@NgModule()
export class SharedSocketIoModule {
  public static forRoot(): ModuleWithProviders<SharedSocketIoModule> {
    return ({
      ngModule: SharedSocketIoModule,
      providers: [
        { provide: HISTORY_STORE, useFactory: (): HistoryStore => {
            return new SingleValueStore<HistoryMessage[], Observable<HistoryMessage[]>>(
              new ObservableStore(
                new InMemoryStore()
              ),
              []
            )
        }},
        { provide: SOCKET_IO_CONTROLLER, useClass: SocketIoGateway, deps: [HISTORY_STORE] },

      ]
    })
  }
}
