import {SingleStoreInterface} from "@shared-kernel/store/contract/store.interface";
import {Observable} from "rxjs";

export type ServerListStore = SingleStoreInterface<number[], Observable<number[]>>
