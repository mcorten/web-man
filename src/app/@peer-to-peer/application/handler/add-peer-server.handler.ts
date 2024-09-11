import { PeerServerCreate } from "@shared-kernel/database/application/contract/table/peer-servers.table";
import { Injectable } from "@angular/core";
import { AddPeerServerAdapter } from "../../infrastructure/gateway/adapter/add-peer-server.adapter";
import { v4 as uuidv4 } from "uuid";
import {Observable, switchMap} from "rxjs";
import {ListPeerServerHandler} from "./list-peer-server.handler";

@Injectable()
export class AddPeerServerHandler {

  public constructor(
    private readonly listPeerServer: ListPeerServerHandler,
    private readonly addPeer: AddPeerServerAdapter
  ) {}
  public handle(contract: {user: Pick<PeerServerCreate['user'], 'nickName'>}): Observable<number> {
    const defaults: {
      turn: PeerServerCreate['turn']
      user: Pick<PeerServerCreate['user'], 'networkId'>
    } = {
      turn: {
        url: 'turn.web-man.eu',
        authName: '',
        authPassword: ''
      },
      user: {
        networkId: uuidv4()
      },
    }

    return this.listPeerServer.handle()
      .pipe(
        switchMap((listPeers) => {
          if (listPeers.length === 0) {
            return this.addPeer.handle({
              turn: defaults.turn,
              user: {
                ...defaults.user,
                nickName: contract.user.nickName,
              },
              user_connection: []
            });
          }

          throw new Error('We do not support multiple peer servers at this moment')
        })
      )



  }
}
