import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HistoryRecordConnection } from "@shared-kernel/socket-io/application/contract/history-message.interface";

@Component({
  selector: 'app-history-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent {
  @Input({ required: true})
  public detail!: HistoryRecordConnection;
}
