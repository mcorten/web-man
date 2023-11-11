import {SingleValueStore} from "@shared-kernel/store";
import {HistoryRecord} from "./history-message.interface";
import {Observable} from "rxjs";

export type HistoryStore = SingleValueStore<HistoryRecord['id'][], Observable<HistoryRecord['id'][]>>;
