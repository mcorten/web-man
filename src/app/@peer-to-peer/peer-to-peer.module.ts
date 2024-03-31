import { NgModule } from "@angular/core";
import { PeerClient } from "@shared-kernel/peer-to-peer/peerClient";
import { NetworkDialogComponent } from './view/network-dialog/network-dialog.component';
import { MatDialogClose, MatDialogContent, MatDialogModule, MatDialogTitle } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { InMemoryStore, ObservableStore, SingleValueStore } from "@shared-kernel/store";
import { Observable } from "rxjs";
import { SERVER_NETWORK_STATUS } from "./application/contract/network-status-store.token";
import { ServerNetworkStatusStore } from "./application/contract/network-status-store.type";
import { NetworkStatus } from "./application/contract/network-status.interface";
import { StartServerHandler } from "./application/handler/start-server.handler";
import {AsyncPipe, NgIf} from "@angular/common";

@NgModule({
  imports: [MatButtonModule, MatDialogModule, AsyncPipe, NgIf],
  providers: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
    PeerClient,

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
  ],
  declarations: [
    NetworkDialogComponent
  ],
})
export class PeerToPeerModule {
}

