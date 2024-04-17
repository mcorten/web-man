import { Observable } from "rxjs";
import { SingleValueStore } from "@shared-kernel/store";

export type PeerUserListStore = SingleValueStore<string[], Observable<string[]>>

