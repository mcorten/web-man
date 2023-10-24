import { Inject, Injectable } from "@angular/core";
import { Database, DATABASE } from "@shared-kernel/database";

@Injectable()
export class ServerListAdapter {
  public constructor(@Inject(DATABASE) private readonly storage: Database) {
  }

  public handle() {
    return this.storage.servers().list()
  }
}
