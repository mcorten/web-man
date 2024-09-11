export interface Message<contract = unknown> {
  __meta: {
    messageIdentifier: string
  }
  contract: contract;
}

export function isMessage(maybe: unknown): maybe is Message {
  if (!(typeof maybe === 'object') || maybe === null) {
    return false;
  }
  console.log('isMessage', maybe)
  return '__meta' in maybe
    && isMeta(maybe.__meta)
    && 'contract' in maybe;
}

export function isMeta(maybe: unknown): maybe is Message['__meta'] {
  if (!(typeof maybe === 'object') || maybe === null) {
    return false;
  }

  return 'messageIdentifier' in maybe && typeof maybe.messageIdentifier === 'string' && maybe.messageIdentifier.length > 0;
}

// TODO this will cause problems with the guard when body is undefined
export interface RequestContract<body = unknown> {
  request: {
    uid: string
  }
  body: body
}

export function isRequestContract(maybe: unknown): maybe is RequestContract {
  if (!(typeof maybe === 'object') || maybe === null) {
    return false;
  }

  return 'request' in maybe && 'body' in maybe;
}

export interface ReplyContract {
  reply: {
    type: 'success' | 'error'
  }
}

export interface ReplyContractSuccess<body = unknown> {
  reply: {
    type: 'success'
  }
  body: body;
}
