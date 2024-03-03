import { LabelListAdapter } from "../../infrastructure/gateway/adapter/label-list.adapter";
import { Injectable } from "@angular/core";

@Injectable()
export class LabelListHandler {
  public constructor(private list: LabelListAdapter) {}

  public handle() {
    return this.list.handle();
  }
}
