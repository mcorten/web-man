import {NgModule} from "@angular/core";
import {PeerClient} from "@shared-kernel/peer-to-peer/peerClient";
import {NetworkDialogComponent} from './view/network-dialog/network-dialog.component';
import {MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {InMemoryStore, ObservableStore, SingleValueStore} from "@shared-kernel/store";
import {Observable} from "rxjs";
import {SERVER_NETWORK_STATUS} from "./application/contract/network-status-store.token";
import {ServerNetworkStatusStore} from "./application/contract/network-status-store.type";
import {NetworkStatus} from "./application/contract/network-status.interface";
import {StartServerHandler} from "./application/handler/start-server.handler";
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {AddPeerServerHandler} from "./application/handler/add-peer-server.handler";
import {AddPeerServerAdapter} from "./infrastructure/gateway/adapter/add-peer-server.adapter";
import {ListPeerServerAdapter} from "./infrastructure/gateway/adapter/list-peer-server.adapter";
import {ListPeerServerHandler} from "./application/handler/list-peer-server.handler";
import {MatListModule} from "@angular/material/list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {PeerServerStatusHandler} from "./application/handler/peer-server-status.handler";
import {ConnectToUserHandler} from "./application/handler/connect-to-user.handler";
import { PEER_USER_LIST_STORE } from "./application/contract/user-connected-list-store.token";
import { PeerUserListStore } from "./application/contract/user-connected-list-store.type";
import { PEER_USER_STATUS_STORE } from "./application/contract/peer-user-status-store.token";
import { PeerUserStatusStore } from "./application/contract/peer-user-status.store";

@NgModule({
  imports: [MatButtonModule, MatDialogModule, AsyncPipe, NgIf, MatListModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, NgForOf, JsonPipe],
  providers: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
    PeerClient,

    AddPeerServerAdapter,
    AddPeerServerHandler,

    ConnectToUserHandler,

    ListPeerServerAdapter,
    ListPeerServerHandler,

    PeerServerStatusHandler,

    StartServerHandler,

    {
      provide: SERVER_NETWORK_STATUS,
      useFactory: (): ServerNetworkStatusStore => {
        return new SingleValueStore<NetworkStatus, Observable<NetworkStatus>>(
          new ObservableStore(
            new InMemoryStore()
          ),
          {
            status: 'uninitialized',
            connectId: '',
          }
        )
      }
    },

    {
      provide: PEER_USER_LIST_STORE,
      useFactory: (): PeerUserListStore => {
        return new SingleValueStore<string[], Observable<string[]>>(
          new ObservableStore(
            new InMemoryStore()
          ),
          []
        )
      }
    },
    {
      provide: PEER_USER_STATUS_STORE,
      useFactory: (): PeerUserStatusStore => {
        return new ObservableStore(
          new InMemoryStore(),
        )
      }
    },
  ],
  declarations: [
    NetworkDialogComponent
  ],
})
export class PeerToPeerModule {
}

