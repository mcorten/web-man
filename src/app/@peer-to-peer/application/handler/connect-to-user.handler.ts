import { Inject, Injectable } from "@angular/core";
import { SERVER_NETWORK_STATUS } from "../contract/network-status-store.token";
import { ServerNetworkStatusStore } from "../contract/network-status-store.type";
import { PeerClient } from "@shared-kernel/peer-to-peer/peerClient";
import { PEER_USER_LIST_STORE } from "../contract/user-connected-list-store.token";
import { PeerUserListStore } from "../contract/user-connected-list-store.type";
import { PEER_USER_STATUS_STORE } from "../contract/peer-user-status-store.token";
import { PeerUserStatusStore } from "../contract/peer-user-status.store";

@Injectable()
export class ConnectToUserHandler {
  public constructor(
    private peerClient: PeerClient,
    @Inject(SERVER_NETWORK_STATUS) private readonly store: ServerNetworkStatusStore,
    @Inject(PEER_USER_LIST_STORE) private readonly userList: PeerUserListStore,
    @Inject(PEER_USER_STATUS_STORE) private readonly userStatus: PeerUserStatusStore,
  ) {
  }

  public handle(contract: { connectionId: string}) {
    // TODO check if there is already a peer server
    const currentUsers = this.userList.value();
    const userConnected = currentUsers.find(_connectionId => _connectionId === contract.connectionId) !== undefined;

    if (!userConnected) {
      this.userList.set([...currentUsers, contract.connectionId])
      this.userStatus.set({connectionStatues: 'disconnected'}, contract.connectionId);
    }

    return this.peerClient.connect(contract.connectionId);
  }
}
