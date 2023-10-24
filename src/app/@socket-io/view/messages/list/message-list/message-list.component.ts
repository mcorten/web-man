import {ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MessageListHandler} from "@message/application/handler/message-list.handler";
import {first, Observable, of} from "rxjs";
import {Message, MessageCreate} from "@shared-kernel/database";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {WantsToAddMessage} from "@message/application/use-case/wants-to-add-message.use-case";
import {v4 as uuidv4} from "uuid";
import {SOCKET_IO_CONTROLLER} from "@shared-kernel/socket-io/application/contract/controller.token";
import {SocketIoGateway} from "@shared-kernel/socket-io/infrastructure/socket-io.gateway";
import {MessageRemoveHandler} from "@message/application/handler/message-remove.handler";
import {WantsToRemoveMessage} from "@message/application/use-case/wants-to-remove-message.use-case";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    NgForOf,
    NgIf,
    AsyncPipe,
    MatTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageListComponent {

  @Input({required: true})
  public messageCollection: Message[] = [];

  @Output()
  public duplicateMessage = new EventEmitter<{messageId: number}>();

  public constructor(
    private readonly messageRemove: MessageRemoveHandler,
    @Inject(SOCKET_IO_CONTROLLER) private readonly connection: SocketIoGateway,
  ) {
  }

  protected removeMessage(id: number) {
    this.messageRemove.handle(new WantsToRemoveMessage(id))
      .pipe(first())
      .subscribe(v => {})
  }

  request(event: string, body: string) {
    this.connection.request({
      event: event,
      body: body,
      acknowledge: (reply) => {}
    })
  }



}
