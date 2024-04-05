import { Inject, Injectable } from "@angular/core";
import { Database, DATABASE } from "@shared-kernel/database";
import { PeerServerCreate } from "@shared-kernel/database/application/contract/table/peer-servers.table";
import {Observable} from "rxjs";

@Injectable()
export class AddPeerServerAdapter {

  public constructor(@Inject(DATABASE) private readonly storage: Database) {
  }
  public handle(contract: PeerServerCreate): Observable<number> {
    return this.storage.peerServers().add(contract)
  }
}
