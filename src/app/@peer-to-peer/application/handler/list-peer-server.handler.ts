import {Injectable} from "@angular/core";
import {ListPeerServerAdapter} from "../../infrastructure/gateway/adapter/list-peer-server.adapter";
import {Observable} from "rxjs";
import {PeerServer} from "@shared-kernel/database/application/contract/table/peer-servers.table";

@Injectable()
export class ListPeerServerHandler {
  public constructor(private readonly listPeerAdapter: ListPeerServerAdapter) {
  }

  public handle(): Observable<PeerServer[]> {
    return this.listPeerAdapter.handle();
  }
}
