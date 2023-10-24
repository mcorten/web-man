import {NgModule} from "@angular/core";
import {DatabaseModule, ServerCreate} from "@shared-kernel/database";
import {ServerAddHandler} from "./application/handler/server-add.handler";
import {ServerAddAdapter} from "./infrastructure/gateway/adapter/server-add.adapter";
import {ServerListAdapter} from "./infrastructure/gateway/adapter/server-list.adapter";
import {ServerListHandler} from "./application/handler/server-list.handler";
import {ServerDetailAdapter} from "./infrastructure/gateway/adapter/server-detail.adapter";
import {ServerDetailHandler} from "./application/handler/server-detail.handler";
import {SERVER_DETAIL} from "./application/contract/server-detail-store.token";

import {InMemoryStore, ObservableStore, SingleValueStore} from "@shared-kernel/store";
import {SERVER_LIST} from "./application/contract/server-list-store.token";
import {Observable} from "rxjs";
import { ServerRemoveHandler } from "@server/application/handler/server-remove.handler";
import { ServerRemoveAdapter } from "@server/infrastructure/gateway/adapter/server-remove.adapter";

@NgModule({
    imports: [
        DatabaseModule,
    ],
    providers: [
        ServerAddAdapter,
        ServerAddHandler,

        ServerListAdapter,
        ServerListHandler,

        ServerDetailAdapter,
        ServerDetailHandler,

        ServerRemoveAdapter,
        ServerRemoveHandler,

        {
            provide: SERVER_LIST,
            useFactory: () => {
                return new SingleValueStore<number[], Observable<number[]>>(
                  new ObservableStore(
                    new InMemoryStore()
                  ),
                  []
                )
            }
        },
        {
            provide: SERVER_DETAIL,
            useFactory: () => {
                return new ObservableStore<ServerCreate>(new InMemoryStore())
            }
        }
    ]
})
export class ServerModule {
}
