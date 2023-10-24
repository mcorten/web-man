import {StoreInterface} from "@shared-kernel/store/contract/store.interface";
import {ServerCreate} from "@shared-kernel/database";
import {Observable} from "rxjs";

export type ServerDetailStore = StoreInterface<ServerCreate, Observable<ServerCreate>>
