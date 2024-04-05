import { Inject, Injectable } from "@angular/core";
import { Database, DATABASE } from "@shared-kernel/database";

@Injectable()
export class ListPeerServerAdapter {

  public constructor(@Inject(DATABASE) private readonly storage: Database) {
  }
  public handle() {
    return this.storage.peerServers().list();
  }
}
