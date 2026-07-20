import { networks } from "@/lib/mainsail/manifest.js";
import { Networks } from "@/lib/mainsail";
import { DataRepository } from "./data.repository.js";
import { Network, NetworkMap } from "./network.repository.contract.js";
import { IProfile } from "./profile.contract.js";

export class NetworkRepository {
	readonly #profile: IProfile;
	#data: DataRepository = new DataRepository();

	public constructor(profile: IProfile) {
		this.#profile = profile;
	}

	public all(): NetworkMap {
		return this.#data.all() as NetworkMap;
	}

	public fill(entries: object): void {
		this.#data.fill(entries);
	}

	public availableNetworks(): Networks.Network[] {
		return Object.values(networks)
			.map((network) => new Networks.Network(network, this.#profile))
			.sort((a, b) => a.displayName().localeCompare(b.displayName()));
	}
}
