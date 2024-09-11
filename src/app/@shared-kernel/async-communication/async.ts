import {Message, ReplyContract, RequestContract} from "./contract/request.contract";
import {v4 as uuidv4} from "uuid";

export class Async {

  private readonly _store = new Map<string, { onReply: () => void}>();

  public request<body = {} | []>(contract: RequestContract<body>, onReply: () => void): Message<RequestContract> {
    // TODO message timeout
    const messageIdentifier = uuidv4();
    this._store.set(messageIdentifier, {
      onReply
    })

    return {
      __meta: {
        messageIdentifier: messageIdentifier
      },
      contract: contract
    }
  }

  public replyForRequest<body = unknown>(request: Message<RequestContract<body>>): Message<ReplyContract> {
    return {
      __meta: {
        messageIdentifier: request.__meta.messageIdentifier
      },
      contract: {
        reply: {
          type: 'success'
        }
      }

    }
  }

}
