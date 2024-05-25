export interface ServerCreate {
  id?: number,
  name: string,
  host: string,
  options: ServerOptions,
}

export interface Server {
  id: number,
  name: string,
  host: string,
  options: ServerOptions,
}

export interface ServerOptions {
  'auth.token' : string
}
