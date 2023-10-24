import {io} from "socket.io-client";

export interface SocketIoGatewayContract {
  connect: (contract: {
    host: string
  }) => void

  request: (contract: {
    event: string,
    body: unknown,
    acknowledge?: (response: unknown) => void
  }) => void
}
