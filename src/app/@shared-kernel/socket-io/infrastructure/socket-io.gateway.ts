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

  public connect(contract: {
    host: string
  }) {
    this._health.next('connecting');

    if (this.connection && this.connection.connected) {
      this.connection.disconnect();
    }

    this.connection = io(contract.host, {
      reconnectionAttempts: 3,
      timeout: 5000,


    });

    this.connection.on('connect', () => {
      this._health.next('connected');
    })


    this.connection.on('connect_error', (e) => {
      if (e.message === 'xhr poll error') {
        this.connection.disconnect();
        this._health.next('disconnected');
        return;
      }

      if (e.message === 'timeout') {
        this.connection.disconnect();
        this._health.next('disconnected');
        return;
      }
    })

    this.connection.on('disconnect', (e) => {
      console.log('connect_error')


    })
    this.connection.on('disconnecting', () => {
      console.log('disconnecting')
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
