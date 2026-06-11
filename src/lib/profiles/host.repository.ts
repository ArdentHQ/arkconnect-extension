import { DataRepository } from './data.repository.js';
import { Host, HostMap, HostSet, IHostRepository } from './contracts.js';
import { IProfile } from './profile.contract.js';

export class HostRepository implements IHostRepository {
    readonly #profile: IProfile;
    #data: DataRepository = new DataRepository();

    public constructor(profile: IProfile) {
        this.#profile = profile;
    }

    public all(): Record<string, HostMap> {
        return this.#data.all() as Record<string, HostMap>;
    }

    public allByNetwork(network: string): HostSet {
        return this.#data.get(network, []) as HostSet;
    }

    public push({ host, name, network }: { host: Host; name: string; network: string }): HostSet {
        if (!this.#data.has(network)) {
            this.#data.set(network, []);
        }

        host.id = name;
        host.custom = true;

        this.#data.get<HostSet>(network)?.push({ host, name });

        this.#profile.status().markAsDirty();

        return this.allByNetwork(network);
    }

    public fill(entries: object): void {
        this.#data.fill(entries);
    }

    public forget(network: string, index?: number): void {
        if (index === undefined) {
            this.#data.forget(network);
        } else {
            this.#data.forgetIndex(network, index);
        }

        this.#profile.status().markAsDirty();
    }
}
