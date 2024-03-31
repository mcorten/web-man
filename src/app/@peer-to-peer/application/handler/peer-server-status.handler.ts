import { PeerServerCreate } from "@shared-kernel/database/application/contract/table/peer-servers.table";
import {Inject, Injectable} from "@angular/core";
import { AddPeerServerAdapter } from "../../infrastructure/gateway/adapter/add-peer-server.adapter";
import { v4 as uuidv4 } from "uuid";
import {Observable, switchMap} from "rxjs";
import {ListPeerServerHandler} from "./list-peer-server.handler";
import {SERVER_NETWORK_STATUS} from "../contract/network-status-store.token";
import {ServerNetworkStatusStore} from "../contract/network-status-store.type";
import {NetworkStatus} from "../contract/network-status.interface";

@Injectable()
export class PeerServerStatusHandler {

  public constructor(
    @Inject(SERVER_NETWORK_STATUS) private readonly store: ServerNetworkStatusStore,
  ) {}
  public handle(): Observable<NetworkStatus> {
    return this.store.get();
  }
}
