import { Inject, Injectable } from "@angular/core";
import { SERVER_NETWORK_STATUS } from "../contract/network-status-store.token";
import { ServerNetworkStatusStore } from "../contract/network-status-store.type";
import { PeerClient } from "@shared-kernel/peer-to-peer/peerClient";
import {PeerServer} from "@shared-kernel/database/application/contract/table/peer-servers.table";

@Injectable()
export class StartServerHandler {
  public constructor(
    private peerClient: PeerClient,
    @Inject(SERVER_NETWORK_STATUS) private readonly store: ServerNetworkStatusStore
  ) {
  }

  public handle(peer: PeerServer ) {

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
      onClientDisconnected: (connectId) => {}
    })
    this.peerClient.initialize(peer.user.networkId, peer.turn);
  }
}
