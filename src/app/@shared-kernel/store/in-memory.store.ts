import {StoreInterface} from "@shared-kernel/store/contract/store.interface";

export class InMemoryStore<Data> implements StoreInterface<Data> {

    private _storage: Map<string, Data> = new Map();

    get(id: string): Data {
        const subject = this._storage.get(id);
        if (subject) {
            return subject
        }

        throw new Error(`Storage item with key [${id}] not found`)
    }

    set(data: Data, id: string): void {
        this._storage.set(id, data);
    }

    value(id: string): Data {
        return this.get(id);
    }

  remove(id: string): void {
      this._storage.delete(id);
  }
}
