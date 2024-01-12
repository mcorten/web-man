import { LabelAddAdapter } from "../../infrastructure/gateway/adapter/label-add.adapter";
import { LabelCreate } from "@shared-kernel/database/application/contract/table/label.table";
import { Injectable } from "@angular/core";

@Injectable()
export class LabelAddHandler {
  public constructor(private add: LabelAddAdapter) {}

  public handle(label: LabelCreate) {
    return this.add.handle(label);
  }
}
