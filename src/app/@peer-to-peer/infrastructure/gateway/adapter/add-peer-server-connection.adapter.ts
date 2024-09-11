import { Inject, Injectable } from "@angular/core";
import { Database, DATABASE } from "@shared-kernel/database";
import {
  PeerServer,
  PeerServerCreate,
  PeerServerUserConnection
} from "@shared-kernel/database/application/contract/table/peer-servers.table";
import {Observable} from "rxjs";

@Injectable()
export class AddPeerServerConnectionAdapter {

  public constructor(@Inject(DATABASE) private readonly storage: Database) {
  }
  public handle(peerServer: PeerServer, userConnection: PeerServerUserConnection): Observable<boolean> {
    return this.storage.peerServers().addConnection(peerServer, userConnection);
  }
}
