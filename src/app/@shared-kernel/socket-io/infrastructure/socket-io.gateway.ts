import {io, Socket} from "socket.io-client";
import {SocketIoGatewayContract} from "../application/contract/gateway.contract";
import {BehaviorSubject} from "rxjs";
import {Inject} from "@angular/core";
import {HISTORY_STORE_LIST, HistoryStore} from "@shared-kernel/socket-io";
import {
  HistoryRecord,
  HistoryRecordConnection,
  HistoryRecordMessage
} from "../application/contract/history-message.interface";
import {v4 as uuidv4} from "uuid";
import {HISTORY_DETAIL_STORE} from "../application/contract/history-store-detail.token";
import {HistoryDetailStore} from "../application/contract/history-store-detail.type";
import {isHistoryRecordConnection} from "../../../@socket-io/view/messages/messages.component";
import {ManagerOptions} from "socket.io-client/build/esm/manager";
import {SocketOptions} from "socket.io-client/build/esm/socket";

export type socketHealth = 'connected' | 'connecting' | 'disconnected';

export class SocketIoGateway implements SocketIoGatewayContract {
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
    host: string,
    options: {
      'auth.token': string
    }
  }) {
    this._health.next('connecting');

    if (this.connection && this.connection.connected) {
      this.connection.disconnect();
    }

    const options: Partial<ManagerOptions & SocketOptions> = {
      reconnectionAttempts: this.reconnect_attempts
    }

    const authToken = contract.options['auth.token'];
    if (authToken.length > 0) {
      options.auth = {
        token: authToken
      }
    }

    this.connection = io(contract.host, options);

    this.connection.on('connect', () => {
      this.current_reconnect_attempts = 0;
      this._health.next('connected');

      const record: HistoryRecordConnection = {
        type: "connection",
        id: uuidv4(),
        status: 'connected'
      }
      this.addToHistory(record);
    })


    this.connection.on('connect_error', (e) => {
      console.log('connect_error', e.message);

      this.current_reconnect_attempts++;

      if (e.message === 'xhr poll error' || e.message === 'timeout') {
        if (this.current_reconnect_attempts < this.reconnect_attempts) {
          this._health.next('connecting');

          const record: HistoryRecordConnection = {
            type: "connection",
            id: uuidv4(),
            status: 'reconnecting'
          }
          this.addToHistory(record);

          return;
        }

        const record: HistoryRecordConnection = {
          type: "connection",
          id: uuidv4(),
          status: 'disconnected'
        }
        this.addToHistory(record);

        this._health.next('disconnected');
      }
    })

    this.connection.onAny((event, message) => {
      const makeHistory: HistoryRecordMessage = {
        type: 'message',
        id: uuidv4(),
        reply: {
          event: event,
          body: message
        }
      };

      this.addToHistory(makeHistory);
    })
  }

  private addToHistory(message: HistoryRecord) {
    // TODO if connection, replace the current if it is the last event
    const current = this._history.value();

    if (current.length > 0 && isHistoryRecordConnection(message)) {
      console.log(message.status);
      const currentConnectionMessage = this._historyDetail.value(current[current.length - 1]);

      if (isHistoryRecordConnection(currentConnectionMessage) && currentConnectionMessage.status === message.status) { // if the last record is a connection message, we update it
        return;
      }
    }
    console.groupEnd();

    this._historyDetail.set(message, message.id);


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
        const makeHistory: HistoryRecordMessage = {
          type: 'message',
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
