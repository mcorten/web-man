import {StoreInterface} from "@shared-kernel/store/contract/store.interface";
import {BehaviorSubject, Observable} from "rxjs";


export class ObservableStore<Data> implements  StoreInterface<
  Data,
  Observable<Data>
> {


  private observables = new Map<string, BehaviorSubject<Data>>()

  public constructor(private readonly store: StoreInterface<Data>) {
  }

  get(id: string): Observable<Data> {
    const _observable = this.observables.get(id);
    if (_observable) {
      return _observable;
    }

    throw new Error(`Storage item with key [${id}] not found`)
  }

  set(data: Data, id: string): void {
    this.store.set(data, id);

    const _observable = this.observables.get(id);
    if (_observable) {
      return _observable.next(data);
    }

    this.observables.set(id, new BehaviorSubject(data))
  }

  value(id: string): Data {
    return this.store.value(id)
  }

  remove(id: string): void {
    this.observables.delete(id);
    this.store.remove(id);
  }
}
