import { Message} from "@shared-kernel/database";

export class WantsToUpdateMessage {
  public constructor(public readonly message: Omit<Message, 'hash'>) {
  }
}
