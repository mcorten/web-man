import { DataConnection } from "peerjs";


export class UserPeer {

  public constructor(private readonly connection: DataConnection) {
  }
  public initialize(events: {
    onConnections: (connection: DataConnection) => void
  } = {
    onConnections: () => { console.warn(this.constructor.name,'connection open'); }
  }) {
    const _connection = this.connection;

    console.warn('hallo');
    _connection.on('open', () =>  {
      events.onConnections(_connection);
      // Receive messages
    });
    _connection.on('data', (data) => {
      console.warn(this.constructor.name, 'Received', data);
    });

    _connection.on('error', (error) => {
      console.warn(this.constructor.name, 'connection error', error)
    })
    _connection.on('close', () => {
      console.warn(this.constructor.name,'server close');
    })
  }

  public send(payload: unknown) {
    this.connection.send(payload);
  }
}
