import { DataConnection } from "peerjs";


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

    console.warn('hallo');
    _connection.on('open', () =>  {
      onConnections(_connection);
    });
    _connection.on('data', (data) => {
      console.warn(this.constructor.name, 'Received', data);
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
