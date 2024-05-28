import { Inject, Injectable } from "@angular/core";
import { Database, DATABASE } from "@shared-kernel/database";
import { ListPeerServerAdapter } from "./list-peer-server.adapter";
import { map, Observable, throwError } from "rxjs";
import { PeerServer } from "@shared-kernel/database/application/contract/table/peer-servers.table";

@Injectable()
export class CurrentPeerServerAdapter {

  public constructor(private readonly listPeerServerAdapter: ListPeerServerAdapter) {
  }
  public handle(): Observable<PeerServer> {
    return this.listPeerServerAdapter.handle()
      .pipe(
        map(_list => {
          if (_list.length === 0) {
            throw new Error('Current peer server not found')
          }

          if (_list.length > 1) {
            throw new Error('Multiple peer servers found')
          }

          return  _list[0];
        })
      )
  }
}
