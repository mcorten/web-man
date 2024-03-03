import { Label } from "@shared-kernel/database/application/contract/table/label.table";
import { LabelFindAdapter } from "../../infrastructure/gateway/adapter/label-find.adapter";
import { Injectable } from "@angular/core";

@Injectable()
export class LabelFindHandler {
  public constructor(private find: LabelFindAdapter) {}

  public handle(label: Partial<Label>) {
    return this.find.handle(label);
  }
}
