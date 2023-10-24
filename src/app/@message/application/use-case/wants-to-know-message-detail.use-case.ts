import { Message } from "@shared-kernel/database";

export class WantsToKnowMessageDetail {
  public constructor(public readonly id: Message['id']) {
  }
}
