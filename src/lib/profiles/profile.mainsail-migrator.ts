import { IProfile, IProfileData, IProfileMainsailMigrator, WalletData } from "./contracts.js";
import { Avatar } from "./helpers/avatar.js";
export class ProfileMainsailMigrator implements IProfileMainsailMigrator {
	readonly #migrationResult: Record<string, any[]> = {
		coldAddresses: [],
		mergedAddresses: [],
	};

	/**
	 * Migrates the profile data from Mainsail to ArkVault if needed.
	 *
	 * @param {IProfileData} [data]
	 * @return {Promise<IProfileData>}
	 * @memberof Profile
	 */
	public async migrate(profile: IProfile, data: IProfileData): Promise<IProfileData> {
		if (this.#requiresMigration(data)) {
			data.wallets = await this.#migrateWallets(profile, data.wallets);
			data.settings = await this.#migrateSettings(profile, data.settings, data.wallets);

			profile.setMigrationResult(this.#migrationResult);
		}

		return data;
	}

	async #migrateWallets(profile: IProfile, wallets: IProfileData["wallets"]): Promise<IProfileData["wallets"]> {
		const migratedWallets: IProfileData["wallets"] = {};
		const seenPublicKeys = new Set<string>();

		for (const [id, wallet] of Object.entries(wallets)) {
			const publicKey: string | undefined = wallet?.data?.["PUBLIC_KEY"];

			// If this public key has already been migrated, skip to avoid duplicates
			if (publicKey !== undefined && seenPublicKeys.has(publicKey)) {
				const mergedWallet = Object.values(wallets).find(
					(d) => d.data[WalletData.PublicKey] === publicKey && migratedWallets[d.id] !== undefined,
				);
				const newWallet = Object.values(migratedWallets).find(
					(d) => d.data[WalletData.PublicKey] === publicKey,
				);

				this.#migrationResult.mergedAddresses.push({
					...wallet.data,
					mergedAddress: mergedWallet?.data.ADDRESS,
					newAddress: newWallet?.data.ADDRESS,
				});
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

		const migratedWallet: IProfileData["wallets"][string] = {
			...wallet,
			data: {
				...wallet.data,
				...newData,
			},
		};

		return migratedWallet;
	}

	async #migrateWalletAddress(
		profile: IProfile,
		walletData: IProfileData["wallets"][string]["data"],
	): Promise<IProfileData["wallets"][string]["data"] | undefined> {
		const publicKey = walletData["PUBLIC_KEY"];
		if (publicKey === undefined) {
			this.#migrationResult.coldAddresses.push(walletData);
			return undefined;
		}

		const wallet = await profile.walletFactory().fromPublicKey({ publicKey });
		const migratedWalletData: IProfileData["wallets"][string]["data"] = {
			ADDRESS: wallet.address(),
		};

		return migratedWalletData;
	}

	#requiresMigration(data: IProfileData): boolean {
		const wallets = Object.values(data.wallets);
		const firstWallet = wallets?.[0];

		return firstWallet?.data["NETWORK"]?.startsWith("ark.") || false;
	}

	async #migrateSettings(
		profile: IProfile,
		settings: IProfileData["settings"],
		wallets: IProfileData["wallets"],
	): Promise<IProfileData["settings"]> {
		const migratedSettings: IProfileData["settings"] = {};

		// Keep settings that remain the same
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

		// Migrate avatar
		if (settings["AVATAR"]) {
			const avatar = settings["AVATAR"];
			if (avatar.startsWith("data:image")) {
				migratedSettings["AVATAR"] = avatar;
			} else {
				migratedSettings["AVATAR"] = Avatar.make(settings["NAME"]);
			}
		}

		this.#migrateDashboardConfiguration(migratedSettings, wallets);

		return migratedSettings;
	}

	#migrateDashboardConfiguration(migratedSettings: IProfileData["settings"], wallets: IProfileData["wallets"]): void {
		const walletAddresses = Object.values(wallets).map((wallet) => wallet.data.ADDRESS);

		migratedSettings["WALLET_SELECTION_MODE"] = "multiple";

		if (walletAddresses.length === 0) {
			migratedSettings["DASHBOARD_CONFIGURATION"] = {
				addressPanelSettings: {
					multiSelectedAddresses: [],
					singleSelectedAddress: [],
				},
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
