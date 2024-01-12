import { Label, LabelCreate } from "@shared-kernel/database/application/contract/table/label.table";

export class WantsToAddLabelToMessage {
  public constructor(public readonly messageId: number, public readonly label: LabelCreate) {
  }
}
