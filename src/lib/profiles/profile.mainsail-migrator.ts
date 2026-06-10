import { IProfileData, WalletData } from "./contracts.js";
import { Avatar } from "./helpers/avatar.js";
import { IProfile } from "./profile.contract.js";

export class ProfileMainsailMigrator {
	public async migrate(profile: IProfile, data: IProfileData): Promise<IProfileData> {
		if (this.#requiresMigration(data)) {
			data.wallets = await this.#migrateWallets(profile, data.wallets);
			data.settings = await this.#migrateSettings(data.settings, data.wallets);
		}

		return data;
	}

	async #migrateWallets(profile: IProfile, wallets: IProfileData["wallets"]): Promise<IProfileData["wallets"]> {
		const migratedWallets: IProfileData["wallets"] = {};
		const seenPublicKeys = new Set<string>();

		for (const [id, wallet] of Object.entries(wallets)) {
			const publicKey: string | undefined = wallet?.data?.["PUBLIC_KEY"];

			if (publicKey !== undefined && seenPublicKeys.has(publicKey)) {
				continue;
			}

			const migratedWallet = await this.#migrateWallet(profile, wallet);
			if (migratedWallet !== undefined) {
				if (publicKey !== undefined) {
					seenPublicKeys.add(publicKey);
				}
				migratedWallets[id] = migratedWallet;
			}
		}

		return migratedWallets;
	}

	async #migrateWallet(
		profile: IProfile,
		wallet: IProfileData["wallets"][string],
	): Promise<IProfileData["wallets"][string] | undefined> {
		const newData = await this.#migrateWalletAddress(profile, wallet.data);

		if (newData === undefined) {
			return undefined;
		}

		return {
			...wallet,
			data: { ...wallet.data, ...newData },
		};
	}

	async #migrateWalletAddress(
		profile: IProfile,
		walletData: IProfileData["wallets"][string]["data"],
	): Promise<IProfileData["wallets"][string]["data"] | undefined> {
		const publicKey = walletData["PUBLIC_KEY"];
		if (publicKey === undefined) {
			return undefined;
		}

		const wallet = await profile.walletFactory().fromPublicKey({ publicKey });
		return { ADDRESS: wallet.address() };
	}

	#requiresMigration(data: IProfileData): boolean {
		const firstWallet = Object.values(data.wallets)?.[0];
		return firstWallet?.data["NETWORK"]?.startsWith("ark.") || false;
	}

	async #migrateSettings(
		settings: IProfileData["settings"],
		wallets: IProfileData["wallets"],
	): Promise<IProfileData["settings"]> {
		const migratedSettings: IProfileData["settings"] = {};

		const settingsToKeep = [
			"AUTOMATIC_SIGN_OUT_PERIOD",
			"BIP39_LOCALE",
			"DO_NOT_SHOW_FEE_WARNING",
			"FALLBACK_TO_DEFAULT_NODES",
			"EXCHANGE_CURRENCY",
			"LOCALE",
			"MARKET_PROVIDER",
			"NAME",
			"THEME",
			"TIME_FORMAT",
			"USE_NETWORK_WALLET_NAMES",
			"USE_TEST_NETWORKS",
		];

		for (const settingKey of settingsToKeep) {
			migratedSettings[settingKey] = settings[settingKey];
		}

		if (settings["AVATAR"]) {
			const avatar = settings["AVATAR"];
			migratedSettings["AVATAR"] = avatar.startsWith("data:image") ? avatar : Avatar.make(settings["NAME"]);
		}

		this.#migrateDashboardConfiguration(migratedSettings, wallets);

		return migratedSettings;
	}

	#migrateDashboardConfiguration(migratedSettings: IProfileData["settings"], wallets: IProfileData["wallets"]): void {
		const walletAddresses = Object.values(wallets).map((wallet) => wallet.data.ADDRESS);

		migratedSettings["WALLET_SELECTION_MODE"] = "multiple";

		if (walletAddresses.length === 0) {
			migratedSettings["DASHBOARD_CONFIGURATION"] = {
				addressPanelSettings: { multiSelectedAddresses: [], singleSelectedAddress: [] },
				addressViewPreference: "multiple",
			};
			return;
		}

		migratedSettings["DASHBOARD_CONFIGURATION"] = {
			addressPanelSettings: {
				multiSelectedAddresses: walletAddresses,
				singleSelectedAddress: [walletAddresses[0]],
			},
			addressViewPreference: "multiple",
		};
	}
}
