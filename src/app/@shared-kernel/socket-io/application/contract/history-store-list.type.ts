import {SingleValueStore} from "@shared-kernel/store";
import {HistoryMessage} from "./history-message.interface";
import {Observable} from "rxjs";

export type HistoryStore = SingleValueStore<HistoryMessage['id'][], Observable<HistoryMessage['id'][]>>;
