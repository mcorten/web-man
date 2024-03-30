import { Observable } from "rxjs";
import { SingleValueStore } from "@shared-kernel/store";
import { NetworkStatus } from "./network-status.interface";

export type ServerNetworkStatusStore = SingleValueStore<NetworkStatus, Observable<NetworkStatus>>
