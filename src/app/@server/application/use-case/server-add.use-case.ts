export class ServerAddUseCase {

  public readonly name: string;

  public constructor(
    public readonly host: string,
    _name?: string
  ) {
    if (typeof _name !== 'string' || _name.length === 0) {
      _name = host;
    }
    this.name = _name
  }
}
