import { Inject, Injectable } from "@angular/core";
import { SERVER_NETWORK_STATUS } from "../contract/network-status-store.token";
import { ServerNetworkStatusStore } from "../contract/network-status-store.type";
import { PeerClient } from "@shared-kernel/peer-to-peer/peerClient";

@Injectable()
export class ConnectToUserHandler {
  public constructor(
    private peerClient: PeerClient,
    @Inject(SERVER_NETWORK_STATUS) private readonly store: ServerNetworkStatusStore
  ) {
  }

  public handle(contract: { connectionId: string}) {
    // TODO check if there is already a peer server
    this.peerClient.connect(contract.connectionId);
  }
}
