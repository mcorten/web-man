import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { SOCKET_IO_CONTROLLER } from "@shared-kernel/socket-io/application/contract/controller.token";
import { SocketIoGateway } from "@shared-kernel/socket-io/infrastructure/socket-io.gateway";
import { BehaviorSubject, first, map, Observable, shareReplay, takeWhile, tap } from "rxjs";
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
import { Message } from "@shared-kernel/database";
import { WantsToAddMessage } from "@message/application/use-case/wants-to-add-message.use-case";

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
  protected editMessages = new BehaviorSubject<Message | null>(null);

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

  protected messages: Observable<Message[]> = this.messageList.handle()
    .pipe(
      tap(collection => {
        if (collection.length === 0) {
          this.drawerOpen.next(true);
        }
      }),
      map(v => v.sort(this.sortAlphabetically)),
      shareReplay(1)
    );

  public constructor(
    protected readonly messageList: MessageListHandler,
    private readonly messageAdd: MessageAddHandler,
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
    }))
      .pipe(first())
      .subscribe(() => {
      })

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

  protected duplicateMessage($event: { messageId: number }) {
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

}
