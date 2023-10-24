export interface StoreInterface<Data, R = Data> {
  get(id : string): R
  value(id : string): Data

  set(data: Data, id: string): void
  remove(id: string): void
}

export interface SingleStoreInterface<Data, R = Data> extends StoreInterface<Data, R> {
  get(): R
  value(): Data

  set(data: Data): void
  remove(): void
}
