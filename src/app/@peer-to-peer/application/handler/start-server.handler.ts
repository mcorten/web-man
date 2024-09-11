import { Inject, Injectable } from "@angular/core";
import { SERVER_NETWORK_STATUS } from "../contract/network-status-store.token";
import { ServerNetworkStatusStore } from "../contract/network-status-store.type";
import { PeerClient } from "@shared-kernel/peer-to-peer/peerClient";
import { PeerServer } from "@shared-kernel/database/application/contract/table/peer-servers.table";
import { ConnectToUserHandler } from "./connect-to-user.handler";
import { combineLatest, combineLatestAll, filter, switchMap, takeWhile, tap } from "rxjs";
import {Message, RequestContract} from "@shared-kernel/async-communication/contract/request.contract";
import {Async} from "@shared-kernel/async-communication/async";

@Injectable()
export class StartServerHandler {
  public constructor(
    private peerClient: PeerClient,
    @Inject(SERVER_NETWORK_STATUS) private readonly store: ServerNetworkStatusStore,
    // private readonly connectToUserHandler: ConnectToUserHandler
  ) {
  }

  public handle(peer: PeerServer) {
    // TODO move this to app.component
    // this.store.get()
    //   .pipe(
    //     takeWhile(_networkStatus => _networkStatus.status !== 'connected', true),
    //     filter(_networkState => _networkState.status === 'connected'),
    //     switchMap(() => {
    //       return combineLatest(
    //         peer.user_connection
    //           .map(_userConnection => this.connectToUserHandler.handle({
    //             connectionId: _userConnection.connectionId
    //           }))
    //       )
    //     })
    //   )
    //   .subscribe(_value => {})

    const async = new Async();
    this.peerClient.initialize(peer.user.networkId, peer.turn, {
      onConnectToTurnServer: (connectId) => {
        this.store.set({
          status: 'connected',
          connectId
        })
      },
      onClientConnected: (id) => {
        const message: Message<RequestContract> = async.request({
          request: { uid: 'GetNickName' },
          body: {}
        }, () => {
          console.log('reply received')
        })

        this.peerClient.sendMessage(id, message);
      },
      onClientDisconnected: (connectId) => {
      }
    });
  }
}
