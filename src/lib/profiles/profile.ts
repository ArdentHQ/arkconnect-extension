/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Networks } from "@/lib/mainsail";

import { Authenticator } from "./authenticator";
import {
	IAuthenticator,
	IDataRepository,
	IPasswordManager,
	IProfile,
	IProfileInput,
	IProfileStatus,
	ISettingRepository,
	IWalletFactory,
	IWalletRepository,
	ProfileSetting,
} from "./contracts";
import { DataRepository } from "./data.repository";
import { AttributeBag } from "./helpers/attribute-bag";
import { Avatar } from "./helpers/avatar";
import { IHostRepository } from "./host.repository.contract";
import { HostRepository } from "./host.repository";
import { NetworkRepository } from "./network.repository";
import { PasswordManager } from "./password";
import { ProfileStatus } from "./profile.status";
import { SettingRepository } from "./setting.repository";
import { WalletFactory } from "./wallet.factory";
import { WalletRepository } from "./wallet.repository";
import { Contracts, Environment } from "./index";
import { LedgerService } from "@/lib/mainsail/ledger.service";
import { ValidatorService } from "./validator.service";
import { ExchangeRateService } from "./exchange-rate.service";
import { TokenService } from "./token.service";
import { ProfileData } from "./profile.enum.contract";
import { isPreview } from "@/utils/test-helpers";

export class Profile implements IProfile {
	/**
	 * The data repository.
	 *
	 * @type {IDataRepository}
	 * @memberof Profile
	 */
	readonly #dataRepository: IDataRepository;

	/**
	 * The host repository.
	 *
	 * @type {IHostRepository}
	 * @memberof Profile
	 */
	readonly #hostRepository: IHostRepository;

	/**
	 * The profile's active network.
	 *
	 * @type {Networks.Network}
	 * @memberof Profile
	 */
	#activeNetwork!: Networks.Network;

	/**
	 * The network repository.
	 *
	 * @type {NetworkRepository}
	 * @memberof Profile
	 */
	readonly #networkRepository: NetworkRepository;

	/**
	 * The setting repository.
	 *
	 * @type {ISettingRepository}
	 * @memberof Profile
	 */
	readonly #settingRepository: ISettingRepository;

	/**
	 * The wallet factory.
	 *
	 * @type {IWalletFactory}
	 * @memberof Profile
	 */
	readonly #walletFactory: IWalletFactory;

	/**
	 * The wallet repository.
	 *
	 * @type {IWalletRepository}
	 * @memberof Profile
	 */
	readonly #walletRepository: IWalletRepository;

	/**
	 * The validators service.
	 *
	 * @type {ValidatorService}
	 * @memberof Profile
	 */
	readonly #validators: ValidatorService;

	/**
	 * The authentication service.
	 *
	 * @type {IAuthenticator}
	 * @memberof Profile
	 */
	readonly #authenticator: IAuthenticator;

	/**
	 * The password service.
	 *
	 * @type {IPasswordManager}
	 * @memberof Profile
	 */
	readonly #password: IPasswordManager;

	/**
	 * The normalised profile data.
	 *
	 * @type {AttributeBag<IProfileInput>}
	 * @memberof Profile
	 */
	readonly #attributes: AttributeBag<IProfileInput>;

	/**
	 * The exchange rate service.
	 *
	 * @type {ExchangeRateService}
	 * @memberof Profile
	 */
	readonly #exchangeRateService: ExchangeRateService;

	/**
	 * The ledger service.
	 *
	 * @type {LedgerService}
	 * @memberof Profile
	 */
	readonly #ledgerService: LedgerService;

	/**
	 * The token service.
	 *
	 * @type {TokenService}
	 * @memberof Profile
	 */
	readonly #tokenService: TokenService;

	/**
	 * The status service.
	 *
	 * @type {IProfileStatus}
	 * @memberof Profile
	 */
	readonly #status: IProfileStatus;

	public constructor(data: IProfileInput, env: Environment) {
		this.#attributes = new AttributeBag<IProfileInput>(data);
		this.#dataRepository = new DataRepository();
		this.#hostRepository = new HostRepository(this);
		this.#networkRepository = new NetworkRepository(this);
		this.#settingRepository = new SettingRepository(this, Object.values(ProfileSetting));
		this.#walletFactory = new WalletFactory(this);
		this.#walletRepository = new WalletRepository(this);
		this.#authenticator = new Authenticator(this);
		this.#validators = new ValidatorService(this);
		this.#password = new PasswordManager();
		this.#status = new ProfileStatus();
		this.#tokenService = new TokenService({ network: this.activeNetwork(), profile: this });
		this.#exchangeRateService = new ExchangeRateService({ storage: env.storage() });
		this.#ledgerService = new LedgerService({ config: this.activeNetwork().config(), profile: this });
	}

	/** {@inheritDoc IProfile.id} */
	public id(): string {
		return this.#attributes.get<string>("id");
	}

	/** {@inheritDoc IProfile.name} */
	public name(): string {
		if (this.settings().missing(ProfileSetting.Name)) {
			return this.#attributes.get<string>("name");
		}

		return this.settings().get<string>(ProfileSetting.Name)!;
	}

	/** {@inheritDoc IProfile.avatar} */
	public avatar(): string {
		const avatarFromSettings: string | undefined = this.settings().get(ProfileSetting.Avatar);

		if (avatarFromSettings) {
			return avatarFromSettings;
		}

		if (this.#attributes.hasStrict("avatar")) {
			return this.#attributes.get<string>("avatar");
		}

		return Avatar.make(this.name());
	}

	/** {@inheritDoc IProfile.avatar} */
	public usesHDWallets(): boolean {
		if (isPreview()) {
			return true;
		}

		return !!this.settings().get(ProfileSetting.UseHDWallets);
	}

	/** {@inheritDoc IProfile.flush} */
	public flush(): void {
		const name: string | undefined = this.settings().get(ProfileSetting.Name);

		if (name === undefined) {
			throw new Error("The name of the profile could not be found. This looks like a bug.");
		}

		this.initialise(name);
	}

	public initialise(name: string): void {
		this.data().flush();
		this.settings().flush();
		this.wallets().flush();
		this.#initialiseSettings(name);
	}

	#initialiseSettings(name: string): void {
		this.settings().set(ProfileSetting.AutomaticSignOutPeriod, 15);
		this.settings().set(ProfileSetting.Bip39Locale, "english");
		this.settings().set(ProfileSetting.DoNotShowFeeWarning, false);
		this.settings().set(ProfileSetting.FallbackToDefaultNodes, true);
		this.settings().set(ProfileSetting.ExchangeCurrency, "BTC");
		this.settings().set(ProfileSetting.Locale, "en-US");
		this.settings().set(ProfileSetting.MarketProvider, "cryptocompare");
		this.settings().set(ProfileSetting.Name, name);
		this.settings().set(ProfileSetting.Theme, "light");
		this.settings().set(ProfileSetting.TimeFormat, "h:mm A");
		this.settings().set(ProfileSetting.UseNetworkWalletNames, true);
		this.settings().set(ProfileSetting.UseTestNetworks, false);
		this.settings().set(ProfileSetting.UseHDWallets, false);
		this.settings().set(ProfileSetting.HideDustTokens, false);
		this.status().markAsDirty();
	}

	/** {@inheritDoc IProfile.data} */
	public data(): IDataRepository {
		return this.#dataRepository;
	}

	/** {@inheritDoc IProfile.hosts} */
	public hosts(): IHostRepository {
		return this.#hostRepository;
	}

	/** {@inheritDoc IProfile.networks} */
	public networks(): NetworkRepository {
		return this.#networkRepository;
	}

	/** {@inheritDoc IProfile.availableNetworks} */
	public availableNetworks(): Networks.Network[] {
		return this.networks().availableNetworks();
	}

	/** {@inheritDoc IProfile.activeNetwork} */
	public activeNetwork(): Networks.Network {
		const { activeNetworkId }: { activeNetworkId?: string } = this.settings().get(
			Contracts.ProfileSetting.DashboardConfiguration,
		) ?? {
			activeNetworkId: undefined,
		};

		if (this.#activeNetwork) {
			const activeNetworkIsChanged = [!!activeNetworkId, this.#activeNetwork.id() !== activeNetworkId].every(
				Boolean,
			);

			if (!activeNetworkIsChanged) {
				return this.#activeNetwork;
			}
		}

		const activeNetwork = this.networks()
			.availableNetworks()
			.find((network) => {
				/* istanbul ignore next -- @preserve */
				if (activeNetworkId === network?.id()) {
					/* istanbul ignore next -- @preserve */
					return network;
				}

				// @TODO: Return mainnet as the default network once it will be available.
				return network?.isTest();
			});

		if (!activeNetwork) {
			throw new Error("Active network is missing");
		}

		this.#activeNetwork = activeNetwork;

		return activeNetwork;
	}

	/** {@inheritDoc IProfile.settings} */
	public settings(): ISettingRepository {
		return this.#settingRepository;
	}

	/** {@inheritDoc IProfile.wallets} */
	public wallets(): IWalletRepository {
		return this.#walletRepository;
	}

	/** {@inheritDoc IProfile.walletFactory} */
	public walletFactory(): IWalletFactory {
		return this.#walletFactory;
	}

	/** {@inheritDoc IProfile.auth} */
	public auth(): IAuthenticator {
		return this.#authenticator;
	}

	/** {@inheritDoc IProfile.password} */
	public password(): IPasswordManager {
		return this.#password;
	}

	/** {@inheritDoc IProfile.status} */
	public status(): IProfileStatus {
		return this.#status;
	}

	/** {@inheritDoc IProfile.usesPassword} */
	public usesPassword(): boolean {
		return this.#attributes.hasStrict("password");
	}

	/** {@inheritDoc IProfile.getAttributes} */
	public getAttributes(): AttributeBag<IProfileInput> {
		return this.#attributes;
	}

	/** {@inheritDoc IProfile.ValidatorService} */
	public validators(): ValidatorService {
		return this.#validators;
	}

	/** {@inheritDoc IProfile.async} */
	public async sync(options?: { networkId?: string; ttl?: number }): Promise<void> {
		await this.wallets().restore(options);

		if (this.wallets().count() > 0) {
			await this.activeNetwork().sync();
		}
	}

	public ledger(): LedgerService {
		return this.#ledgerService;
	}

	public exchangeRates(): ExchangeRateService {
		return this.#exchangeRateService;
	}

	public walletSelectionMode(): "single" | "multiple" {
		return this.settings().get(ProfileSetting.WalletSelectionMode) ?? "single";
	}

	public tokens(): TokenService {
		return this.#tokenService;
	}

	public whitelistedContractAddresses(): string[] {
		return this.data().get(ProfileData.WhitelistedContractAddresses, []) as string[];
	}

	public whitelistContractAddress(address: string): string[] {
		const existing = this.whitelistedContractAddresses();
		if (existing.some((a) => a.toLowerCase() === address.toLowerCase())) {
			return existing;
		}
		const updated = [...existing, address];
		this.data().set(ProfileData.WhitelistedContractAddresses, updated);
		this.status().markAsDirty();
		return updated;
	}

	public removeWhitelistedContractAddress(address: string): string[] {
		const updated = this.whitelistedContractAddresses().filter(
			(a) => a.toLowerCase() !== address.toLowerCase(),
		);
		this.data().set(ProfileData.WhitelistedContractAddresses, updated);
		this.status().markAsDirty();
		return updated;
	}
}
