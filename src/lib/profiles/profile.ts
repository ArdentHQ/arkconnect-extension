import { Networks } from '@/lib/mainsail';

import { Authenticator } from './authenticator';
import {
    IAuthenticator,
    IDataRepository,
    IHostRepository,
    IPasswordManager,
    IProfile,
    IProfileInput,
    IProfileStatus,
    ISettingRepository,
    IWalletFactory,
    IWalletRepository,
    ProfileSetting,
} from './contracts';
import { DataRepository } from './data.repository';
import { AttributeBag } from './helpers/attribute-bag';
import { Avatar } from './helpers/avatar';
import { HostRepository } from './host.repository';
import { NetworkRepository } from './network.repository';
import { PasswordManager } from './password';
import { ProfileStatus } from './profile.status';
import { SettingRepository } from './setting.repository';
import { WalletFactory } from './wallet.factory';
import { WalletRepository } from './wallet.repository';
import { Environment } from './environment';
import { LedgerService } from '@/lib/mainsail/ledger.service';
import { ValidatorService } from './validator.service';
import { ExchangeRateService } from './exchange-rate.service';
import { TokenService } from './token.service';
import { ProfileData } from './profile.enum.contract';

export class Profile implements IProfile {
    readonly #dataRepository: IDataRepository;

    readonly #hostRepository: IHostRepository;

    #activeNetwork!: Networks.Network;

    readonly #networkRepository: NetworkRepository;

    readonly #settingRepository: ISettingRepository;

    readonly #walletFactory: IWalletFactory;

    readonly #walletRepository: IWalletRepository;

    readonly #validators: ValidatorService;

    readonly #authenticator: IAuthenticator;

    readonly #password: IPasswordManager;

    readonly #attributes: AttributeBag<IProfileInput>;

    readonly #exchangeRateService: ExchangeRateService;

    readonly #ledgerService: LedgerService;

    readonly #tokenService: TokenService;

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
        this.#ledgerService = new LedgerService({
            config: this.activeNetwork().config(),
            profile: this,
        });
    }

    public id(): string {
        return this.#attributes.get<string>('id');
    }

    public name(): string {
        return (
            this.settings().get<string>(ProfileSetting.Name) ?? this.#attributes.get<string>('name')
        );
    }

    public avatar(): string {
        const avatarFromSettings: string | undefined = this.settings().get(ProfileSetting.Avatar);

        if (avatarFromSettings) {
            return avatarFromSettings;
        }

        if (this.#attributes.hasStrict('avatar')) {
            return this.#attributes.get<string>('avatar');
        }

        return Avatar.make(this.name());
    }

    public initialise(name: string): void {
        this.data().flush();
        this.settings().flush();
        this.wallets().flush();
        this.#initialiseSettings(name);
    }

    #initialiseSettings(name: string): void {
        this.settings().set(ProfileSetting.AutomaticSignOutPeriod, 15);
        this.settings().set(ProfileSetting.Bip39Locale, 'english');
        this.settings().set(ProfileSetting.DoNotShowFeeWarning, false);
        this.settings().set(ProfileSetting.FallbackToDefaultNodes, true);
        this.settings().set(ProfileSetting.ExchangeCurrency, 'BTC');
        this.settings().set(ProfileSetting.Locale, 'en-US');
        this.settings().set(ProfileSetting.MarketProvider, 'cryptocompare');
        this.settings().set(ProfileSetting.Name, name);
        this.settings().set(ProfileSetting.Theme, 'light');
        this.settings().set(ProfileSetting.TimeFormat, 'h:mm A');
        this.settings().set(ProfileSetting.UseNetworkWalletNames, true);
        this.settings().set(ProfileSetting.UseTestNetworks, false);
        this.settings().set(ProfileSetting.HideDustTokens, false);
        this.status().markAsDirty();
    }

    public data(): IDataRepository {
        return this.#dataRepository;
    }

    public hosts(): IHostRepository {
        return this.#hostRepository;
    }

    public networks(): NetworkRepository {
        return this.#networkRepository;
    }

    public availableNetworks(): Networks.Network[] {
        return this.#networkRepository.availableNetworks();
    }

    public activeNetwork(): Networks.Network {
        const { activeNetworkId }: { activeNetworkId?: string } = this.settings().get(
            ProfileSetting.DashboardConfiguration,
        ) ?? {
            activeNetworkId: undefined,
        };

        if (this.#activeNetwork) {
            const activeNetworkIsChanged = [
                !!activeNetworkId,
                this.#activeNetwork.id() !== activeNetworkId,
            ].every(Boolean);

            if (!activeNetworkIsChanged) {
                return this.#activeNetwork;
            }
        }

        const activeNetwork = this.#networkRepository
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
            throw new Error('Active network is missing');
        }

        this.#activeNetwork = activeNetwork;

        return activeNetwork;
    }

    public settings(): ISettingRepository {
        return this.#settingRepository;
    }

    public wallets(): IWalletRepository {
        return this.#walletRepository;
    }

    public walletFactory(): IWalletFactory {
        return this.#walletFactory;
    }

    public auth(): IAuthenticator {
        return this.#authenticator;
    }

    public password(): IPasswordManager {
        return this.#password;
    }

    public status(): IProfileStatus {
        return this.#status;
    }

    public usesPassword(): boolean {
        return this.#attributes.hasStrict('password');
    }

    public getAttributes(): AttributeBag<IProfileInput> {
        return this.#attributes;
    }

    public validators(): ValidatorService {
        return this.#validators;
    }

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

    public walletSelectionMode(): 'single' | 'multiple' {
        return this.settings().get(ProfileSetting.WalletSelectionMode) ?? 'single';
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
