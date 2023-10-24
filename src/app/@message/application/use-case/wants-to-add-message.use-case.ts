import { MessageCreate } from "@shared-kernel/database";

export class WantsToAddMessage {
  public constructor(public readonly message: Omit<MessageCreate, 'id' | 'hash'>) {
  }
}
