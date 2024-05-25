export interface SocketIoGatewayContract {
  connect: (contract: {
    host: string
    options: ConnectOptions
  }) => void

  request: (contract: {
    event: string,
    body: unknown,
    acknowledge?: (response: unknown) => void
  }) => void
}

interface ConnectOptions{
  'auth.token': string
}
