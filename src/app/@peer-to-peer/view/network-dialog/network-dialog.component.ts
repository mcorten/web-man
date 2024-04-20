import {Component, Inject, OnInit} from '@angular/core';
import {first, Observable, shareReplay, switchMap} from "rxjs";
import {NetworkStatus} from "../../application/contract/network-status.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AddPeerServerHandler} from "../../application/handler/add-peer-server.handler";
import {PeerServerStatusHandler} from "../../application/handler/peer-server-status.handler";
import {StartServerHandler} from "../../application/handler/start-server.handler";
import {ListPeerServerHandler} from "../../application/handler/list-peer-server.handler";
import {PeerServer} from "@shared-kernel/database/application/contract/table/peer-servers.table";
import {ConnectToUserHandler} from "../../application/handler/connect-to-user.handler";
import {PEER_USER_LIST_STORE} from "../../application/contract/user-connected-list-store.token";
import {PeerUserListStore} from "../../application/contract/user-connected-list-store.type";
import {PEER_USER_STATUS_STORE} from "../../application/contract/peer-user-status-store.token";
import {PeerUserStatusStore} from "../../application/contract/peer-user-status.store";

@Component({
  selector: 'app-network-dialog',
  templateUrl: './network-dialog.component.html',
  styleUrls: ['./network-dialog.component.css']
})
export class NetworkDialogComponent implements OnInit {

  protected networkStatus!: Observable<NetworkStatus>;
  protected peerServerList!: Observable<PeerServer[]>;

  public readonly networkForm = new FormGroup({
    nickname: new FormControl('', { validators: [Validators.required], nonNullable: true }),
  });


  public readonly connectForm = new FormGroup({
    networkId: new FormControl('', { validators: [Validators.required], nonNullable: true }),
  });

  public constructor(
    private readonly peerServerStatue: PeerServerStatusHandler,
    private addPeerServer: AddPeerServerHandler,
    private startServer: StartServerHandler,
    private listServer: ListPeerServerHandler,

    private readonly connectToUser: ConnectToUserHandler,
    @Inject(PEER_USER_LIST_STORE) protected readonly userList: PeerUserListStore,
    @Inject(PEER_USER_STATUS_STORE) protected readonly userStatus: PeerUserStatusStore,

  ) {}

  ngOnInit(): void {
    // TODO takeUntil destroyed
    this.networkStatus = this.peerServerStatue.handle().pipe(shareReplay());
    this.peerServerList = this.listServer.handle().pipe(shareReplay());

  }

  protected submitNetworkForm() {
    if (!this.networkForm.valid) {
      this.networkForm.markAsTouched();
      return;
    }

    this.addPeerServer.handle({
      user: {
        nickName: this.networkForm.controls.nickname.value
      }
    }).pipe(
      first(),
      switchMap(() => {
        return this.listServer.handle()
      })
    ).subscribe((peerServers) => {
      if (peerServers.length === 1) {
        const peerServer = peerServers[0];
        return this.startServer.handle(peerServer);
      }
    })
  }

  protected submitConnectForm() {
    if (!this.connectForm.valid) {
      this.connectForm.markAsTouched();
      return;
    }


    this.connectToUser.handle({
      connectionId: this.connectForm.controls.networkId.value
    })

  }
}
