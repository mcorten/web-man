import { Label, LabelCreate } from "@shared-kernel/database/application/contract/table/label.table";

export class WantsToRemoveLabelFromMessage {
  public constructor(public readonly messageId: number, public readonly label: Label) {
  }
}
