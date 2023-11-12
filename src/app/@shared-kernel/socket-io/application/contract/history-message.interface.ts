export interface HistoryRecord {
  id: string,
  type: 'message' | 'connection' // TODO enum
}

export interface HistoryRecordMessage extends HistoryRecord {
  type: 'message',
  request?: {
    event: string,
    body: unknown
  },
  reply?: {
    event?: unknown,
    body: unknown
  }
}

export interface HistoryRecordConnection extends HistoryRecord {
  type: 'connection'
  status: 'connected' | 'reconnecting' | 'disconnected'
}

