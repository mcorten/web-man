import { ObservableStore } from "@shared-kernel/store";
import { HistoryRecord } from "./history-message.interface";

export type HistoryDetailStore = ObservableStore<HistoryRecord>;
