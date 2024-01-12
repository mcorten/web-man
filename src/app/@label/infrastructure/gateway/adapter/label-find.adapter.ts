import { Inject, Injectable } from "@angular/core";
import { Database, DATABASE } from "@shared-kernel/database";
import { WantsToRemoveMessage } from "@message/application/use-case/wants-to-remove-message.use-case";
import { WantsToAddMessage } from "@message/application/use-case/wants-to-add-message.use-case";
import { WantsToAddLabelToMessage } from "@message/application/use-case/wants-to-add-label-to-message.use-case";
import { Observable } from "rxjs";
import { Label } from "@shared-kernel/database/application/contract/table/label.table";

// TODO move to label domain
@Injectable()
export class LabelFindAdapter {
  public constructor(@Inject(DATABASE) private readonly storage: Database) {
  }

  public handle(find: Partial<Label>): Observable<Label | undefined> {
    return this.storage.labels().findOne(find)
  }
}
