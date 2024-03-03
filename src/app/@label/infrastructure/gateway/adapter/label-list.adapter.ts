import { Inject, Injectable } from "@angular/core";
import { Database, DATABASE } from "@shared-kernel/database";
import { Observable } from "rxjs";
import { Label } from "@shared-kernel/database/application/contract/table/label.table";

// TODO move to label domain
@Injectable()
export class LabelListAdapter {
  public constructor(@Inject(DATABASE) private readonly storage: Database) {
  }

  public handle(): Observable<Label[]> {
    return this.storage.labels().list()
  }
}
