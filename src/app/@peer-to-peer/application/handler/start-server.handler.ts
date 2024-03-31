import { Inject, Injectable } from "@angular/core";
import { SERVER_NETWORK_STATUS } from "../contract/network-status-store.token";
import { ServerNetworkStatusStore } from "../contract/network-status-store.type";
import { PeerClient } from "@shared-kernel/peer-to-peer/peerClient";

@Injectable()
export class StartServerHandler {
  public constructor(
    private peerClient: PeerClient,
    @Inject(SERVER_NETWORK_STATUS) private readonly store: ServerNetworkStatusStore
  ) {
  }

  public handle() {
    this.peerClient.onEvent({
      onConnectToServer: (connectId) => {
        console.log('onConnectToServer', connectId);
        this.store.set({
          status: 'connected',
          connectId
        })
      },
      onClientConnected: (id) => {
        console.log('on client connected');

        this.peerClient.sendMessage(id, 'welcome');
      }

    })
    this.peerClient.initialize();
  }
}
