import { Networks, Services } from "@/lib/mainsail";

import { ConfigKey } from "@/lib/mainsail";
import { IProfile } from "./contracts";

type KnownWalletRegistry = Record<string, Services.KnownWallet[]>;

export class KnownWalletService {
	readonly #registry: KnownWalletRegistry = {};

	/** {@inheritDoc IKnownWalletService.sync} */
	public async sync(profile: IProfile, network: Networks.Network): Promise<void> {
		try {
			const url = network.config().get<string>(ConfigKey.KnownWallets);
			const response = await fetch(url, { headers: { Accept: "application/json" } });
			if (!response.ok) return;
			const results = await response.json();

			if (Array.isArray(results)) {
				this.#registry[network.id()] = results;
			}
		} catch {
			// Do nothing if it fails. It's not critical functionality.
		}
	}

	/** {@inheritDoc IKnownWalletService.network} */
	public name(network: string, address: string): string | undefined {
		return this.#findByAddress(network, address)?.name;
	}

	/** {@inheritDoc IKnownWalletService.network} */
	public is(network: string, address: string): boolean {
		return this.#findByAddress(network, address) !== undefined;
	}

	/** {@inheritDoc IKnownWalletService.network} */
	public isExchange(network: string, address: string): boolean {
		return this.#hasType(network, address, "exchange");
	}

	/** {@inheritDoc IKnownWalletService.network} */
	public isTeam(network: string, address: string): boolean {
		return this.#hasType(network, address, "team");
	}

	#findByAddress(network: string, address: string): Services.KnownWallet | undefined {
		const registry: Services.KnownWallet[] = this.#registry[network];

		if (registry === undefined) {
			return undefined;
		}

		return registry.find((wallet: Services.KnownWallet) => wallet.address === address);
	}

	#hasType(network: string, address: string, type: string): boolean {
		return this.#findByAddress(network, address)?.type === type;
	}
}
