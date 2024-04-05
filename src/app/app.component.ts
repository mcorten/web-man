import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {NetworkDialogComponent} from "./@peer-to-peer/view/network-dialog/network-dialog.component";
import {StartServerHandler} from "./@peer-to-peer/application/handler/start-server.handler";
import {PeerServerStatusHandler} from "./@peer-to-peer/application/handler/peer-server-status.handler";
import {ListPeerServerHandler} from "./@peer-to-peer";
import {first} from "rxjs";


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
    protected readonly networkStatusStore: PeerServerStatusHandler,
    public dialog: MatDialog,
    private listServer: ListPeerServerHandler
  ) {
    this.networkStatus = networkStatusStore.handle(); // TODO take until
  }

  ngOnInit(): void {
    this.listServer.handle()
      .pipe(
        first()
      )
      .subscribe(peerServer => {
        if (peerServer.length === 1) {
          this.startServer.handle(peerServer[0].turn)
        }
      })

  }

  protected networkDialog() {
    this.dialog.open(NetworkDialogComponent);
  }

}


