import {ServerOptions} from "@shared-kernel/database";

export class ServerAddUseCase {

  public readonly name: string;
  public readonly options: ServerOptions;

  public constructor(
    public readonly host: string,

    _name?: string,
    _options?: ServerOptions,

  ) {
    if (typeof _name !== 'string' || _name.length === 0) {
      _name = host;
    }
    this.name = _name

    this.options = _options ?? { "auth.token": '' }
  }
}
