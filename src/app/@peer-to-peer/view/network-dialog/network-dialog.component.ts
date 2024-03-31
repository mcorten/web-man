import { Component, Inject } from '@angular/core';
import { SERVER_NETWORK_STATUS } from "../../application/contract/network-status-store.token";
import { ServerNetworkStatusStore } from "../../application/contract/network-status-store.type";
import { Observable } from "rxjs";
import { NetworkStatus } from "../../application/contract/network-status.interface";

@Component({
  selector: 'app-network-dialog',
  templateUrl: './network-dialog.component.html',
  styleUrls: ['./network-dialog.component.css']
})
export class NetworkDialogComponent {

  protected networkStatus: Observable<NetworkStatus>;
  public constructor(@Inject(SERVER_NETWORK_STATUS) private readonly store: ServerNetworkStatusStore) {
    this.networkStatus = store.get();
  }
}
