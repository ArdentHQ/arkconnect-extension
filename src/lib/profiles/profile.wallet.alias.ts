import { Contracts, Contracts as ProfileContracts } from "@/lib/profiles";
import { getDefaultAlias, getLedgerDefaultAlias } from "@/lib/domains/wallet/utils/get-default-alias";
import { WalletData } from "./wallet.enum";
import { ProfileSetting } from "./contracts";

export class WalletAliasProvider {
	#profile: ProfileContracts.IProfile;

	constructor(profile: ProfileContracts.IProfile) {
		this.#profile = profile;
	}

	#validatorUsername(address: string): string | undefined {
		try {
			return this.#profile
				.validators()
				.all(this.#profile.activeNetwork().id())
				.find((wallet) => wallet.address() === address)
				?.username();
		} catch {
			return undefined;
		}
	}

	public findAliasByAddress(address: string, network?: string): string | undefined {
		const profile = this.#profile;
		const networkId = network ?? this.#profile.activeNetwork().id();

		try {
			const useNetworkWalletNames = profile.settings().get<boolean>(ProfileSetting.UseNetworkWalletNames);
			const wallet = profile.wallets().findByAddressWithNetwork(address, networkId);
			const validatorName = this.#validatorUsername(address);
			const localName = wallet ? wallet.displayName() : undefined;
			const username = wallet ? wallet.username() : undefined;

			return useNetworkWalletNames
				? username || localName || validatorName
				: localName || username || validatorName;
		} catch {
			return undefined;
		}
	}
	generateAlias(wallet: Contracts.IReadWriteWallet, path?: string): string {
		if (wallet.isLedger()) {
			return getLedgerDefaultAlias({
				path: path ?? wallet.data().get(WalletData.DerivationPath)!,
				profile: this.#profile,
			});
		}

		return getDefaultAlias({ profile: this.#profile });
	}
}
