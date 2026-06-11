import { Networks } from '@/lib/mainsail';

import {
    IAuthenticator,
    IDataRepository,
    IHostRepository,
    INetworkRepository,
    IPasswordManager,
    IProfileStatus,
    ISettingRepository,
    IWalletData,
    IWalletFactory,
    IWalletRepository,
} from './contracts.js';
import { AttributeBag } from './helpers/attribute-bag.js';
import { LedgerService } from '@/lib/mainsail/ledger.service.js';
import { ValidatorService } from './validator.service.js';
import { ExchangeRateService } from './exchange-rate.service.js';
import { TokenService } from './token.service.js';

export interface IProfileData {
    id: string;
    data: Record<string, any>;
    hosts: Record<string, any>;
    networks: Record<string, any>;
    settings: Record<string, any>;
    wallets: Record<string, IWalletData>;
}

export interface IProfileInput {
    id: string;
    name: string;
    avatar?: string;
    password?: string;
    data: string;
}

export interface IWalletExportOptions {
    excludeEmptyWallets: boolean;
    excludeLedgerWallets: boolean;
    addNetworkInformation: boolean;
}

export interface IProfileExportOptions extends IWalletExportOptions {
    saveGeneralSettings: boolean;
}

export interface IProfile {
    id(): string;
    name(): string;
    avatar(): string;
    data(): IDataRepository;
    hosts(): IHostRepository;
    networks(): INetworkRepository;
    activeNetwork(): Networks.Network;
    availableNetworks(): Networks.Network[];
    settings(): ISettingRepository;
    wallets(): IWalletRepository;
    walletFactory(): IWalletFactory;
    auth(): IAuthenticator;
    password(): IPasswordManager;
    usesPassword(): boolean;
    sync(options?: { networkId?: string; ttl?: number }): Promise<void>;
    getAttributes(): AttributeBag<IProfileInput>;
    status(): IProfileStatus;
    validators(): ValidatorService;
    exchangeRates(): ExchangeRateService;
    ledger(): LedgerService;
    walletSelectionMode(): 'single' | 'multiple';
    tokens(): TokenService;
    whitelistedContractAddresses(): string[];
}

export interface IProfileExporter {
    export(password?: string, options?: IProfileExportOptions): Promise<string>;
}
