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
  }
}

export interface PeerServer {
  id: number,
  turn: PeerServerCreate['turn'],
  user: PeerServerCreate['user']
}
