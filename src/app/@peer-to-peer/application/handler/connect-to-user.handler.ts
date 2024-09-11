import { Inject, Injectable } from "@angular/core";
import { SERVER_NETWORK_STATUS } from "../contract/network-status-store.token";
import { ServerNetworkStatusStore } from "../contract/network-status-store.type";
import { PeerClient } from "@shared-kernel/peer-to-peer/peerClient";
import { PEER_USER_LIST_STORE } from "../contract/user-connected-list-store.token";
import { PeerUserListStore } from "../contract/user-connected-list-store.type";
import { PEER_USER_STATUS_STORE } from "../contract/peer-user-status-store.token";
import { PeerUserStatusStore } from "../contract/peer-user-status.store";
import {
  AddPeerServerConnectionAdapter
} from "../../infrastructure/gateway/adapter/add-peer-server-connection.adapter";
import { CurrentPeerServerAdapter } from "../../infrastructure/gateway/adapter/current-peer-server.adapter";
import { first, map, Observable, of, switchMap, tap } from "rxjs";

@Injectable()
export class ConnectToUserHandler {
  public constructor(
    private peerClient: PeerClient,
    @Inject(SERVER_NETWORK_STATUS) private readonly store: ServerNetworkStatusStore,
    @Inject(PEER_USER_LIST_STORE) private readonly userList: PeerUserListStore,
    @Inject(PEER_USER_STATUS_STORE) private readonly userStatus: PeerUserStatusStore,
    private readonly currentPeerServerAdapter: CurrentPeerServerAdapter,
    private readonly addPeerConnection: AddPeerServerConnectionAdapter,
  ) {
  }

  public handle(contract: { connectionId: string }): Observable<void> {
    return this.currentPeerServerAdapter
      .handle()
      .pipe(
        // update current store
        tap(_peerServer => {
          const currentUsers = this.userList.value();

          const userConnected = currentUsers.find(_connectionId => _connectionId === contract.connectionId) !== undefined;

          if (!userConnected) {
            this.userList.set([...currentUsers, contract.connectionId])
            this.userStatus.set({connectionStatues: 'disconnected'}, contract.connectionId);
          }
        }),
        switchMap(_peerServer => {
          const userAlreadyAsConnection = _peerServer.user_connection.find(_user => _user.networkId === contract.connectionId)
          if (userAlreadyAsConnection) {
            return of(_peerServer);
          }

          return this.addPeerConnection.handle(_peerServer, {
            networkId: contract.connectionId,
            nickName: contract.connectionId
          }).pipe(
            first()
          );
        }),
        map(() => {
          return this.peerClient.connect(contract.connectionId, {
            onConnect: id => {},
            onDisconnect: id => {}
          });
        })
      )
  }
}
