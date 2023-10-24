import { SingleStoreInterface } from "@shared-kernel/store/contract/store.interface";
import { Observable } from "rxjs";
import { Message } from "@shared-kernel/database";

export type MessageListStore = SingleStoreInterface<Omit<Message, 'hash'>[], Observable<Message[]>>
