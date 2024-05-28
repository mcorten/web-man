import { Inject, Injectable } from "@angular/core";
import { SERVER_NETWORK_STATUS } from "../contract/network-status-store.token";
import { ServerNetworkStatusStore } from "../contract/network-status-store.type";
import { PeerClient } from "@shared-kernel/peer-to-peer/peerClient";
import { PeerServer } from "@shared-kernel/database/application/contract/table/peer-servers.table";
import { ConnectToUserHandler } from "./connect-to-user.handler";
import { combineLatest, combineLatestAll, filter, switchMap, takeWhile, tap } from "rxjs";

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

    this.peerClient.onEvent({
      onConnectToTurnServer: (connectId) => {
        this.store.set({
          status: 'connected',
          connectId
        })
      },
      onClientConnected: (id) => {
        this.peerClient.sendMessage(id, 'welcome');
      },
      onClientDisconnected: (connectId) => {
      }
    })
    this.peerClient.initialize(peer.user.networkId, peer.turn);
  }
}
