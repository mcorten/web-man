import { Inject, Injectable } from "@angular/core";
import { Database, DATABASE } from "@shared-kernel/database";
import { WantsToRemoveMessage } from "@message/application/use-case/wants-to-remove-message.use-case";
import { WantsToAddMessage } from "@message/application/use-case/wants-to-add-message.use-case";
import { WantsToAddLabelToMessage } from "@message/application/use-case/wants-to-add-label-to-message.use-case";
import { Observable } from "rxjs";
import { Label, LabelCreate } from "@shared-kernel/database/application/contract/table/label.table";

// TODO move to label domain
@Injectable()
export class LabelAddAdapter {
  public constructor(@Inject(DATABASE) private readonly storage: Database) {
  }

  public handle(add: LabelCreate): Observable<number> {
    return this.storage.labels().add(add);
  }
}
