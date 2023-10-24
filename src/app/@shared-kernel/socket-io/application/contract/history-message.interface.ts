export interface HistoryMessage {
  id: string,
  request?: {
    event: string,
    body: unknown
  },
  reply?: {
    event?: unknown,
    body: unknown
  }
}
