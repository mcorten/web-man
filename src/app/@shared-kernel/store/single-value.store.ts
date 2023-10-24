import { SingleStoreInterface, StoreInterface } from "@shared-kernel/store/contract/store.interface";

export class SingleValueStore<Data, R = Data> implements SingleStoreInterface<
  Data,
  R
> {
  private readonly id = 'id'


  public constructor(private readonly store: StoreInterface<Data, R>, private readonly initValue: Data) {

    this.set(initValue);
  }

  get(): R {
    return this.store.get(this.id);
  }

  set(data: Data): void {
    this.store.set(data, this.id);
  }

  value(): Data {
    return this.store.value(this.id);
  }

  remove(): void {
    this.set(this.initValue);
  }
}
