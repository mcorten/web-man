import Peer from "peerjs";
import {UserPeer} from "./user-peer";
import {ServerPeer} from "./server-peer";
import {Inject, Injectable} from "@angular/core";
import {v4} from "uuid";
import {PeerServer} from "@shared-kernel/database/application/contract/table/peer-servers.table";
import {PEER_USER_STATUS_STORE} from "../../@peer-to-peer/application/contract/peer-user-status-store.token";
import {PeerUserStatusStore} from "../../@peer-to-peer/application/contract/peer-user-status.store";
import {PEER_USER_LIST_STORE} from "../../@peer-to-peer/application/contract/user-connected-list-store.token";
import {PeerUserListStore} from "../../@peer-to-peer/application/contract/user-connected-list-store.type";
interface  PeerServerEvents {
  onConnectToTurnServer?: (connectId: string) => void,
  onClientConnected?: (id: string) => void,
  onClientDisconnected?: (id: string) => void,
}


interface PeerClientEvents {
  onConnect?: (id: string) => void,
  onDisconnect?: (id: string) => void,
}

@Injectable()
export class PeerClient {
  private server: ServerPeer | null = null;
  private users: Map<string, UserPeer> = new Map();

  private peer!: Peer;

  private onConnectToTurnServerDefault = (connectId: string) => console.log(this.constructor.name, 'onConnectToTurnServerDefault');
  private onClientConnectedDefault = (connectId: string) => console.log(this.constructor.name, 'onClientConnectedDefault');
  private onClientDisconnectedDefault = (connectId: string) => console.log(this.constructor.name, 'onClientDisconnectedDefault');

  public constructor(
    @Inject(PEER_USER_LIST_STORE) private readonly userList: PeerUserListStore,
    @Inject(PEER_USER_STATUS_STORE) private readonly userStatus: PeerUserStatusStore
  ) {
  }


  public initialize(connectionId: string, turnServer: PeerServer['turn'], events: PeerServerEvents) {
    const peer = new Peer(connectionId, {
      host: turnServer.url,
      secure: true,
      path: '/turn'
    });
    this.peer = peer;

    const onConnectToTurnServer = events.onConnectToTurnServer ?? this.onConnectToTurnServerDefault;
    const onClientConnected = events.onClientConnected ?? this.onClientConnectedDefault;

    peer.on("open", (id) => {
      console.warn("open 1", id);

      onConnectToTurnServer(id);

      this.server = new ServerPeer(peer)
      this.server.initialize({
        onConnections: (id: string, connection) => {
          const user = new UserPeer(connection);
          user.initialize({
            onConnectionClose: () => {
              this.userStatus.set({connectionStatues: "disconnected"}, id);
            }
          })

          this.users.set(id, user);

          // TODO move this logic to a handler
          const userList = this.userList.value();
          if (userList.includes(id) === false) { // a user can reconnect
            this.userList.set([...this.userList.value(), id]);
          }

          this.userStatus.set({connectionStatues: "connected"}, id);

          onClientConnected(id);
        }

      });
    })
    peer.on('error', (e) => {
      if (e.message.includes('ID') && e.message.includes('is taken')) { // ID already taken

      }

      console.error(this.constructor.name, 'error', e.message);
    })
  }

  public connect(id: string, events: PeerClientEvents): void {
    const onClientConnected = events.onConnect ?? this.onClientConnectedDefault; // TODO this is a duplicate from above here, fix the duplication
    const onClientDisconnected = events.onDisconnect ?? this.onClientDisconnectedDefault;

    const user = new UserPeer(this.peer.connect(id));
    user.initialize({
      onConnections: () => { // when this is the client that connects to a server
        this.users.set(id, user);

        this.userStatus.set({
          connectionStatues: "connected"
        }, id);

        onClientConnected(id);
      },
      onConnectionClose: () => { // when this is the client and the server disconnects
        this.userStatus.set({
          connectionStatues: "disconnected"
        }, id);

        onClientDisconnected(id);
      }
    });

  }

  public sendMessage(clientId: string, payload: unknown) {
    this.users.get(clientId)?.send(payload);
  }
}
