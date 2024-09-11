export interface PeerServerCreate {
  id?: number,
  turn: {
    url: string,
    authName: string,
    authPassword: string,
  },
  user: {
    networkId: string,
    nickName: string
  },
  user_connection: PeerServerUserConnection[]
}

export interface PeerServer {
  id: number,
  turn: PeerServerCreate['turn'],
  user: PeerServerCreate['user'],
  user_connection: PeerServerUserConnection[]
}

export interface PeerServerUserConnection {
  networkId: string
  nickName: string
}
