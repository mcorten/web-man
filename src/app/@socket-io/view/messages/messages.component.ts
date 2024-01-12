import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { SOCKET_IO_CONTROLLER } from "@shared-kernel/socket-io/application/contract/controller.token";
import { SocketIoGateway } from "@shared-kernel/socket-io/infrastructure/socket-io.gateway";
import { BehaviorSubject, first, map, Observable, of, shareReplay, switchMap, takeWhile, tap } from "rxjs";
import { Router } from "@angular/router";
import { MessageAddHandler } from "@message/application/handler/message-add.handler";
import { MessageListHandler } from "@message/application/handler/message-list.handler";
import { HISTORY_STORE_LIST, HistoryStore } from "@shared-kernel/socket-io";
import {
  HistoryRecord,
  HistoryRecordConnection,
  HistoryRecordMessage
} from "@shared-kernel/socket-io/application/contract/history-message.interface";
import { HISTORY_DETAIL_STORE } from "@shared-kernel/socket-io/application/contract/history-store-detail.token";
import { HistoryDetailStore } from "@shared-kernel/socket-io/application/contract/history-store-detail.type";
import { Message, MessageLabel } from "@shared-kernel/database";
import { WantsToAddMessage } from "@message/application/use-case/wants-to-add-message.use-case";
import { MessageUpdateHandler } from "@message/application/handler/message-update.handler";
import { WantsToUpdateMessage } from "@message/application/use-case/wants-to-update-message.use-case";
import { Label, LabelCreate } from "@shared-kernel/database/application/contract/table/label.table";
import { MessageAddLabelHandler } from "@message/application/handler/message-add-label.handler";
import { WantsToAddLabelToMessage } from "@message/application/use-case/wants-to-add-label-to-message.use-case";
import { LabelListAdapter } from "../../../@label/infrastructure/gateway/adapter/label-list.adapter";
import { MessageRemoveLabelHandler } from "@message/application/handler/message-remove-label.handler";
import {
  WantsToRemoveLabelFromMessage
} from "@message/application/use-case/wants-to-remove-label-from-message.use-case";

// TODO move and rename
export interface HMessage extends HistoryRecordMessage  {isUpdate: boolean, isRequestReply: boolean}

export function isHistoryRecordConnection(a: unknown): a is HistoryRecordConnection {
  if (a === null) {
    return false;
  }

  if (typeof a === 'object') {
    return 'type' in a &&  a.type === 'connection';
  }

  return false;
}

export function isHistoryRecordMessage(a: unknown): a is HMessage {
  if (a === null) {
    return false;
  }

  if (typeof a === 'object') {
    return 'type' in a &&  a.type === 'message';
  }

  return false;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements OnInit {

  protected drawerOpen = new BehaviorSubject(false);
  protected editMessages = new BehaviorSubject<(Message & {labels: Label[]}) | null>(null);

  protected showHistory: Observable<Array<HistoryRecord['id']>> = this._history.get()
    .pipe(
      map(historyCollection => [...historyCollection].reverse()),
      shareReplay(1)
    );

  // TODO move
  protected isHistoryRecordMessage = isHistoryRecordMessage;
  protected isHistoryRecordConnection = isHistoryRecordConnection;

  protected historyDetail(id: string): Observable<HMessage | HistoryRecord> {
    return this._historyDetail.get(id).pipe(
      map(detail => {
        if (this.isHistoryRecordMessage(detail)) {
          return {
            ...detail,
            type: 'message',
            isUpdate: detail.request === undefined,
            isRequestReply: detail.request !== undefined
          }
        }

        return detail;
      })
    )
  }

  private sortAlphabetically = (a: Message,b: Message) => {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  };

  protected messages: Observable<Array<Message & MessageLabel> > = this.messageList.handle()
    .pipe(
      tap(collection => {
        if (collection.length === 0) {
          this.drawerOpen.next(true);
        }
      }),
      switchMap(messages => {
        return this.labelList.handle()
          .pipe(
            switchMap((labels): Observable<Array<Message & MessageLabel>> => {
              return of(messages.map(m => {
                if (m.labels.length > 0) {
                  let a: Message & MessageLabel =  {
                    ...m,
                    labels: m.labels.map(label => {
                      const maybeLabel = labels.find(l => l.id === label.id);
                      if (maybeLabel === undefined) {
                        throw new Error('Label not found')
                      }

                      return maybeLabel
                    })
                  }

                  return a;
                }


                return {...m, labels: []};
              }));
            }),
            tap(v => {
              /**
               * this needs to happen because the message store is 1 big array with messages
               * Would be better to have a message list that contains Observables so we can next on them
               */
              const currentMessage = this.editMessages.value;
              if (currentMessage === null) {
                return
              }

              const updatedMessage = v.find((c => c.id === currentMessage.id));
              if (updatedMessage === undefined) {
                return;
              }

              this.editMessages.next(updatedMessage);
            })
          )


      }),
      map(v => v.sort(this.sortAlphabetically)),
      shareReplay(1),
    );

  public constructor(
    protected readonly messageList: MessageListHandler,
    private readonly messageAdd: MessageAddHandler,
    private readonly messageUpdate: MessageUpdateHandler,
    private readonly messageAddLabel: MessageAddLabelHandler,
    private readonly messageRemoveLabel: MessageRemoveLabelHandler,
    private readonly labelList: LabelListAdapter,
    @Inject(SOCKET_IO_CONTROLLER) private readonly connection: SocketIoGateway,
    @Inject(HISTORY_STORE_LIST) private readonly _history: HistoryStore,
    @Inject(HISTORY_DETAIL_STORE) private readonly _historyDetail: HistoryDetailStore,
    private readonly router: Router
  ) {

  }

  ngOnInit(): void {
    this.connection.health
      .pipe(
        // TODO take untill destroyed
        takeWhile(v => v !== 'connected', true),
      )
      .subscribe((v) => {
        if (v === 'disconnected') {
          this.router.navigate(['/socket-io']);
        }
      })
  }


  request(name: string, event: string, body: string) {
    this.messageAdd.handle(new WantsToAddMessage({
      event,
      body,
      name,
      labels: []
    }))
      .pipe(first())
      .subscribe()

    this.connection.request({
      event: event,
      body: body,
      acknowledge: (reply) => {
      }
    })
  }

  protected removeHistoryMessage(id: string) {
    const current = this._history.value()
      .filter(_id => _id !== id);

    this._history.set(current);
    this._historyDetail.remove(id);
  }

  protected removeAllHistory() {
    const current = this._history.value();

    this._history.set([]);
    current.forEach(
      _id => {
        this._historyDetail.remove(_id)
      }
    );
  }

  protected saveMessage(name: string, event: string, body: string, id?: number) {
    this.messageList.handle()
      .pipe(
        first(),
        switchMap((list) => {
          let existingMessage = undefined;
          if (id) {
            existingMessage = list.find((existing => existing.id === id))
          }

          if (existingMessage) {
            const update = new WantsToUpdateMessage({
              id: existingMessage.id,
              event,
              body,
              name,
              labels: []
            });

            return this.messageUpdate.handle(update)
          }

          return this.messageAdd.handle(new WantsToAddMessage({
            event,
            body,
            name,
            labels: []
          }))
            .pipe(first())
        })
      )
      .subscribe((list) => {})
  }

  protected editMessage($event: { messageId: number }) {
    this.messages
      .pipe(
        first(),
        map(messages => {
          return {
            messageCollection: messages,
            message: messages.find(i => i.id === $event.messageId)
          }
        }),
      )
      .subscribe((m) => {
        if (m.message === undefined) {
          return;
        }

        this.editMessages.next(m.message);
        this.drawerOpen.next(true);
      })
  }

  protected addMessage() {
    this.drawerOpen.next(true);
  }

  protected drawerClose() {
    this.editMessages.next(null);
    this.drawerOpen.next(false)
  }

  protected addLabel(message: Pick<Message, 'id'>, label: Pick<LabelCreate, 'name'>) {
    this.messageAddLabel
      .handle(new WantsToAddLabelToMessage(message.id, label))
      .subscribe(result => console.log('result'));
  }
  protected removeLabel(message: Pick<Message, 'id'>, label: Label) {
    this.messageRemoveLabel
      .handle(new WantsToRemoveLabelFromMessage(message.id, label))
      .subscribe(result => console.log('result'));
  }
}
