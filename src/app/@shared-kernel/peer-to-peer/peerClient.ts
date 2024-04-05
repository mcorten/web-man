import Peer from "peerjs";
import { UserPeer } from "./user-peer";
import { ServerPeer } from "./server-peer";
import { Injectable } from "@angular/core";
import {v4} from "uuid";
import {PeerServer} from "@shared-kernel/database/application/contract/table/peer-servers.table";

interface PeerClientEvents  {
  onConnectToServer: (connectId: string) => void,
  onClientConnected: (id: string) => void,
}

@Injectable()
export class PeerClient {
  private server: ServerPeer | null = null;
  private users: Map<string, UserPeer> = new Map();

  private peer!: Peer;
  private events: PeerClientEvents = {
    onConnectToServer: (connectId: string) => {}, // connected to stun/turn server
    onClientConnected: () => {} // client connects
  }

  public onEvent(events: PeerClientEvents): void {
    this.events = events;
  }

  public initialize(turnServer: PeerServer['turn']) {
    const peer = new Peer(v4(),{
      host: turnServer.url,
      secure: true,
      path: '/turn'
    });
    this.peer = peer;

    peer.on("open", (id) => {
      console.warn("open 1", id);

      this.events.onConnectToServer(id);

      this.server = new ServerPeer(peer)
      this.server.initialize({
        onConnections: (id: string, connection) => {
          const user = new UserPeer(connection);
          user.initialize()

          this.users.set(id, user);

          this.events.onClientConnected(id);
        }
      });
    })
  }

  public connect(id: string) {
    const user = new UserPeer(this.peer.connect(id));
    user.initialize({
      onConnections: () => {
        this.users.set(id, user);

        this.events.onClientConnected(id);
      }
    });

  }

  public sendMessage(clientId: string, payload: unknown) {
    this.users.get(clientId)?.send(payload);
  }
}
