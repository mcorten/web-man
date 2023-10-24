export interface MessageCreate {
  id?: number,
  name: string,
  hash: string,
  event: string
  body: string
}

export interface Message {
  id: number,
  name: string,
  hash: string,
  event: string
  body: string
}

