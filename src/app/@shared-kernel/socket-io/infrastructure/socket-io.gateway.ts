import { io, Socket } from "socket.io-client";
import { SocketIoGatewayContract } from "../application/contract/gateway.contract";
import { BehaviorSubject } from "rxjs";
import { Inject } from "@angular/core";
import { HISTORY_STORE_LIST, HistoryStore } from "@shared-kernel/socket-io";
import { HistoryMessage } from "../application/contract/history-message.interface";
import { v4 as uuidv4 } from "uuid";
import { HISTORY_DETAIL_STORE } from "../application/contract/history-store-detail.token";
import { HistoryDetailStore } from "../application/contract/history-store-detail.type";

export type socketHealth = 'connected' | 'connecting' | 'disconnected';

export class SocketIoGateway implements SocketIoGatewayContract{
  private connection!: Socket;

  private readonly _health = new BehaviorSubject<socketHealth>("disconnected");
  public readonly health = this._health.asObservable();

  public constructor(
    @Inject(HISTORY_STORE_LIST) private readonly _history: HistoryStore,
    @Inject(HISTORY_DETAIL_STORE) private readonly _historyDetail: HistoryDetailStore,
  ) {
  }

  private readonly reconnect_attempts = 5;
  private current_reconnect_attempts_default = 1;
  private current_reconnect_attempts = this.current_reconnect_attempts_default;

  public connect(contract: {
    host: string
  }) {
    this._health.next('connecting');

    if (this.connection && this.connection.connected) {
      this.connection.disconnect();
    }

    this.connection = io(contract.host, {
      reconnectionAttempts: this.reconnect_attempts
    });

    this.connection.on('connect', () => {
      this.current_reconnect_attempts = 0;
      this._health.next('connected');
    })


    this.connection.on('connect_error', (e) => {
      console.log('connect_error', e.message);

      this.current_reconnect_attempts++;

      if (e.message === 'xhr poll error' || e.message === 'timeout') {
        if (this.current_reconnect_attempts <= this.reconnect_attempts) {
          this._health.next('connecting');
          return;
        }

        this._health.next('disconnected');
        return;
      }
    })

    this.connection.onAny((event, message) => {
      const makeHistory: HistoryMessage = {
        id: uuidv4(),
        reply: {
          event: event,
          body: message
        }
      };

      this.addToHistory(makeHistory);
    })
  }

  private addToHistory(message: HistoryMessage) {
    this._historyDetail.set(message, message.id);

    const current = this._history.value();
    current.push(message.id);
    this._history.set(current);

  }

  public request(contract: {
    event: string,
    body: unknown,
    acknowledge?: (response: unknown) => void
  }) {
    this.connection.emit(contract.event, contract.body, (reply: unknown, error: unknown,) => {

      if (contract.acknowledge) {
        const makeHistory: HistoryMessage = {
          id: uuidv4(),
          request: {
            event: contract.event,
            body: contract.body
          },
          reply: {
            body: reply
          }
        };
        this.addToHistory(makeHistory);

        contract.acknowledge(reply);
      }
    });
  }
}
