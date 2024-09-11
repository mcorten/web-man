import { DataConnection } from "peerjs";
import {
  isMessage,
  isRequestContract,
  Message,
  RequestContract
} from "@shared-kernel/async-communication/contract/request.contract";
import {Async} from "@shared-kernel/async-communication/async";


export class UserPeer {

  private readonly onConnectionsDefault = () => { console.warn(this.constructor.name,'connection close');};
  private readonly onConnectionCloseDefault = () => { console.warn(this.constructor.name,'connection close');};

  public constructor(private readonly connection: DataConnection) {
  }
  public initialize(events: {
    onConnections?: (connection: DataConnection) => void
    onConnectionClose?: (connectionId: string) => void
  } = {}) {
    const _connection = this.connection;

    const onConnections = events.onConnections ?? this.onConnectionsDefault;
    const onConnectionClose = events.onConnectionClose ?? this.onConnectionCloseDefault;

    _connection.on('open', () =>  {
      onConnections(_connection);
    });
    _connection.on('data', (data) => {

      if (isMessage(data)) {
        const contract = data.contract;
        if (isRequestContract(contract)) {
          // TODO do something with the request
          const reply = (new Async()).replyForRequest({
            ...data,
            contract
          });

          console.warn(this.constructor.name, 'Received REQUEST', data);
          console.warn(this.constructor.name, 'Request reply', reply);
          return;
        }

        console.error(this.constructor.name, 'Failed to handle received message', data);

      } else {
        console.error(this.constructor.name, 'Received invalid message', data);
      }
    });

    _connection.on('error', (error) => {
      console.warn(this.constructor.name, 'connection error', error)
    })
    _connection.on('close', () => {
      onConnectionClose(this.connection.peer);
    })
  }

  public send(payload: unknown) {
    this.connection.send(payload);
  }
}
