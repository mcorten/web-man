import { Inject, Injectable } from "@angular/core";
import { MESSAGE_LIST } from "@message/application/contract/message-list-store.token";
import { MessageListStore } from "@message/application/contract/message-list-store.type";
import { map, Observable, switchMap, tap } from "rxjs";
import { WantsToAddLabelToMessage } from "@message/application/use-case/wants-to-add-label-to-message.use-case";
import { MessageAddLabelAdapter } from "@message/infrastructure/gateway/adapter/message-add-label.adapter";
import { Label } from "@shared-kernel/database/application/contract/table/label.table";
import { LabelAddHandler, LabelFindOrCreateHandler } from "@label/index";

@Injectable()
export class MessageAddLabelHandler {

  public constructor(
    private readonly findOrCreateLabel: LabelFindOrCreateHandler,
    private readonly add: MessageAddLabelAdapter,
    @Inject(MESSAGE_LIST) private readonly store: MessageListStore
  ) {
  }

  public handle(useCase: WantsToAddLabelToMessage): Observable<null> {

    // if we have an existing label
    if (useCase.label.id) { // TODO guard isLabel()
      throw new Error('not implemented yet')
    }

    // if the label does not exists
    return this.findOrCreateLabel.handle({
      name: useCase.label.name
    }).pipe(
      switchMap(label => {
        return this.add.handle({
          messageId: useCase.messageId,
          label: label
        }).pipe(map((v) => ({ success: v, label: label})))
      }),
      tap((contract) => {
        if (contract.success) {
          this.updateStore(useCase.messageId, contract.label)
        }
      }),
      map(() => null)
    )
  }

  private updateStore(messageId : number, label: Label) {
    const updatedContent = this.store.value()
      .map(v => {
        if (messageId === v.id) {
          return {
            ...v,
            labels: [...v.labels].concat([label])
          }
        }

        return v;
      })

    this.store.set(updatedContent)
  }
}
