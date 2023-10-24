import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SOCKET_IO_CONTROLLER} from "@shared-kernel/socket-io/application/contract/controller.token";
import {SocketIoGateway} from "@shared-kernel/socket-io/infrastructure/socket-io.gateway";
import {first, map, Observable, shareReplay, takeWhile} from "rxjs";
import {Router} from "@angular/router";
import {MessageAddHandler} from "@message/application/handler/message-add.handler";
import {WantsToAddMessage} from "@message/application/use-case/wants-to-add-message.use-case";
import {MessageListHandler} from "@message/application/handler/message-list.handler";
import {HISTORY_STORE, HistoryStore} from "@shared-kernel/socket-io";
import {HistoryMessage} from "@shared-kernel/socket-io/application/contract/history-message.interface";


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements OnInit {
  protected sendRequestForm = new FormGroup({
      event: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
      name: new FormControl('', {nonNullable: true, validators: []}),
      body: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    }
  )

  protected showHistory: Observable<Array<HistoryMessage & {isUpdate: boolean, isRequestReply: boolean}>> = this._history.get().pipe(
    map(historyCollection => historyCollection.map(item => {
      return {
        ...item,
        isUpdate: item.request === undefined,
        isRequestReply: item.request !== undefined
      }
    })),
    map(historyCollection => [...historyCollection].reverse()),
    shareReplay(1)
  );

  protected messages = this.messageList.handle()
    .pipe(
      shareReplay(1)
    );

  public constructor(
    protected readonly messageList: MessageListHandler,
    private readonly messageAdd: MessageAddHandler,
    @Inject(SOCKET_IO_CONTROLLER) private readonly connection: SocketIoGateway,
    @Inject(HISTORY_STORE) private readonly _history: HistoryStore,
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

  requestForm() {
    if (!this.sendRequestForm.valid) {
      return;
    }

    const event = this.sendRequestForm.controls.event.value;
    const body = this.sendRequestForm.controls.body.value;

    this.request(event,body);
  }

  request(event: string, body: string) {
    let name = this.sendRequestForm.controls.name.value;
    if (name.length === 0) {
      name = this.sendRequestForm.controls.event.value;
    }

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
      .filter(historyMessage => historyMessage.id !== id);

    this._history.set(current);
  }

  protected removeAllHistory() {
    this._history.set([]);
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

        this.sendRequestForm.controls.event.setValue(m.message.event);
        this.sendRequestForm.controls.name.setValue(m.message.name);
        this.sendRequestForm.controls.body.setValue(m.message.body);
      })

  }

  protected isString(data: unknown): data is string {
    return typeof data === 'string';
  }
}
