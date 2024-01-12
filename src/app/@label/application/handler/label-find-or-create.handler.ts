import { Label } from "@shared-kernel/database/application/contract/table/label.table";
import { Injectable } from "@angular/core";
import { LabelAddHandler } from "./label-add.handler";
import { LabelFindHandler } from "./label-find.handler";
import { map, Observable, of, switchMap, tap } from "rxjs";

@Injectable()
export class LabelFindOrCreateHandler {
  public constructor(
    private find: LabelFindHandler,
    private add: LabelAddHandler,
  ) {}

  public handle(label: Partial<Label>): Observable<Label> {
    return this.find.handle({
      name: label.name
    }).pipe(
      switchMap(_label => {
        // if label found by name
        if (_label) {
          return of(_label);
        }

        if (label.name) {
          return this.add.handle({
            name: label.name
          }).pipe(
            switchMap(id => this.find.handle({id}) as Observable<Label>)
          )
        }

        throw new Error('Adding label only implemented by name')
      }),
    )
  }
}
