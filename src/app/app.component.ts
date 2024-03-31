import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { PeerClient } from "@shared-kernel/peer-to-peer/peerClient";
import { BehaviorSubject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { NetworkDialogComponent } from "./@peer-to-peer/view/network-dialog/network-dialog.component";
import { NetworkStatus } from "./@peer-to-peer/application/contract/network-status.interface";
import { StartServerHandler } from "./@peer-to-peer/application/handler/start-server.handler";
import { SERVER_NETWORK_STATUS } from "./@peer-to-peer/application/contract/network-status-store.token";
import { ServerNetworkStatusStore } from "./@peer-to-peer/application/contract/network-status-store.type";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  protected readonly title = 'Web-Man';

  protected networkStatus;

  public constructor(
    private startServer: StartServerHandler,
    @Inject(SERVER_NETWORK_STATUS) protected readonly networkStatusStore: ServerNetworkStatusStore,
    public dialog: MatDialog
  ) {
    this.networkStatus = networkStatusStore.get();
  }

  ngOnInit(): void {
    // this.startServer.handle();
  }

  protected networkDialog() {
    this.dialog.open(NetworkDialogComponent);
  }

}


