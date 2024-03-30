import Peer, { DataConnection } from "peerjs";

export class ServerPeer {
  public constructor(private readonly connection: Peer) {
  }
  public initialize(events: {
    onConnections: (id: string, connection: DataConnection) => void
  }) {
    this.connection.on('connection',  (conn) => {
      console.warn('server connection', conn);

      conn.on('open', () =>  {
        events.onConnections(conn.peer, conn);
      });
    })
  }
}
