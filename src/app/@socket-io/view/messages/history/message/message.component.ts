import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HMessage } from "../../messages.component";

@Component({
  selector: 'app-history-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input({ required: true})
  public detail!: HMessage;

  @Output()
  public remove = new EventEmitter();

  protected isString(data: unknown): data is string {
    return typeof data === 'string';
  }
}
