import { ObservableStore } from "@shared-kernel/store";
import { HistoryMessage } from "./history-message.interface";

export type HistoryDetailStore = ObservableStore<HistoryMessage>;
