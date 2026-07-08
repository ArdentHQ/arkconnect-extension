import { DataRepository } from './data.repository.js';
import { HostMap, HostSet, IHostRepository } from './contracts.js';

export class HostRepository implements IHostRepository {
    #data: DataRepository = new DataRepository();

    public all(): Record<string, HostMap> {
        return this.#data.all() as Record<string, HostMap>;
    }

    public allByNetwork(network: string): HostSet {
        return this.#data.get(network, []) as HostSet;
    }

    public fill(entries: object): void {
        this.#data.fill(entries);
    }
}
