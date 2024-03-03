import { Inject, Injectable } from "@angular/core";
import { MESSAGE_LIST } from "@message/application/contract/message-list-store.token";
import { MessageListStore } from "@message/application/contract/message-list-store.type";
import { map, Observable, switchMap, tap } from "rxjs";
import { WantsToAddLabelToMessage } from "@message/application/use-case/wants-to-add-label-to-message.use-case";
import { MessageAddLabelAdapter } from "@message/infrastructure/gateway/adapter/message-add-label.adapter";
import { Label } from "@shared-kernel/database/application/contract/table/label.table";
import { LabelAddHandler, LabelFindOrCreateHandler } from "@label/index";
import { MessageRemoveLabelAdapter } from "@message/infrastructure/gateway/adapter/message-remove-label.adapter";
import {
  WantsToRemoveLabelFromMessage
} from "@message/application/use-case/wants-to-remove-label-from-message.use-case";

@Injectable()
export class MessageRemoveLabelHandler {

  public constructor(
    private readonly messageRemoveLabel: MessageRemoveLabelAdapter,
    @Inject(MESSAGE_LIST) private readonly store: MessageListStore
  ) {
  }

  public handle(useCase: WantsToRemoveLabelFromMessage): Observable<null> {
    return this.messageRemoveLabel.handle(useCase)
      .pipe(
        tap(() => this.updateStore(useCase.messageId, useCase.label))
      )
  }

  private updateStore(messageId : number, label: Label) {
    const updatedContent = this.store.value()
      .map(v => {
        if (messageId === v.id) {
          return {
            ...v,
            labels: v.labels.filter(_label => _label.id !== label.id)
          }
        }

        return v;
      })

    this.store.set(updatedContent)
  }
}
