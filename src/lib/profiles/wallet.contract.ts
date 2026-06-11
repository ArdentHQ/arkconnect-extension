import { Contracts, Networks, Services } from '@/lib/mainsail';
import { BigNumber } from '@/lib/helpers';

import {
    IDataRepository,
    IProfile,
    ISettingRepository,
    ISignatoryFactory,
    ITransactionIndex,
    ITransactionService,
    IVoteRegistry,
    IWalletImportFormat,
    IWalletMutator,
    IWalletSynchroniser,
} from './contracts.js';
import { AttributeBag } from './helpers/attribute-bag.js';
import { MessageService } from '@/lib/mainsail/message.service.js';
import { ClientService } from '@/lib/mainsail/client.service.js';
import { AddressService } from '@/lib/mainsail/address.service.js';
import { PublicKeyService } from '@/lib/mainsail/public-key.service.js';
import { TransactionService } from '@/lib/mainsail/transaction.service.js';
import { ValidatorService } from './validator.service.js';
import { ExchangeRateService } from './exchange-rate.service.js';
import { SignatoryService } from '@/lib/mainsail/signatory.service.js';
import { Manifest } from '@/lib/mainsail/manifest.class';
import { WalletTokenRepository } from './wallet-token.repository.js';

export type WalletBalanceType = keyof Contracts.WalletBalance;

export type WalletDerivationMethod = 'bip39' | 'bip44' | 'bip49' | 'bip84';

export interface IWalletData {
    id: string;
    data: Record<string, any>;
    settings: Record<string, any>;
}

export interface IReadWriteWalletAttributes {
    id: string;
    initialState: IWalletData;
    restorationState: { full: boolean; partial: boolean };
    // Will be empty initially
    wallet: Contracts.WalletData | undefined;
    address: string;
    publicKey: string | undefined;
    avatar: string;
    isMissingNetwork: boolean;
}

export interface IReadWriteWallet {
    profile(): IProfile;

    hasSyncedWithNetwork(): boolean;

    id(): string;

    network(): Networks.Network;

    currency(): string;

    exchangeCurrency(): string;

    alias(): string | undefined;

    accountName(): string | undefined;

    displayName(): string | undefined;

    primaryKey(): string;

    importMethod(): string;

    derivationMethod(): WalletDerivationMethod;

    address(): string;

    publicKey(): string | undefined;

    balance(type?: WalletBalanceType): BigNumber;

    convertedBalance(type?: WalletBalanceType): BigNumber;

    nonce(): BigNumber;

    avatar(): string;

    data(): IDataRepository;

    settings(): ISettingRepository;

    toData(): Contracts.WalletData;

    toObject(): IWalletData;

    tokenCount(): number;

    knownName(): string | undefined;

    secondPublicKey(): string | undefined;

    username(): string | undefined;

    validatorPublicKey(): string | undefined;

    isResignedDelegate(): boolean;

    isValidator(): boolean;

    isLegacyValidator(): boolean;

    validatorFee(): number | undefined;

    isResignedValidator(): boolean;

    isKnown(): boolean;

    isOwnedByExchange(): boolean;

    isOwnedByTeam(): boolean;

    isHDWallet(): boolean;

    isLedger(): boolean;

    isLedgerNanoS(): boolean;

    isLedgerNanoX(): boolean;

    isStarred(): boolean;

    isCold(): boolean;

    toggleStarred(): void;

    networkId(): string;

    manifest(): Manifest;

    validators(): ValidatorService;

    client(): ClientService;

    exchangeRates(): ExchangeRateService;

    addressService(): AddressService;

    publicKeyService(): PublicKeyService;

    ledger(): Services.LedgerService;

    link(): Services.LinkService;

    message(): MessageService;

    signatory(): SignatoryService;

    transaction(): ITransactionService;

    transactionService(): TransactionService;

    transactionTypes(): Networks.TransactionType[];

    explorerLink(): string;

    markAsFullyRestored(): void;

    hasBeenFullyRestored(): boolean;

    markAsPartiallyRestored(): void;

    hasBeenPartiallyRestored(): boolean;

    markAsMissingNetwork(): void;

    isMissingNetwork(): boolean;

    getAttributes(): AttributeBag<IReadWriteWalletAttributes>;

    synchroniser(): IWalletSynchroniser;

    mutator(): IWalletMutator;

    voting(): IVoteRegistry;

    transactionIndex(): ITransactionIndex;

    signingKey(): IWalletImportFormat;

    confirmKey(): IWalletImportFormat;

    canVote(): boolean;

    canWrite(): boolean;

    actsWithMnemonic(): boolean;

    actsWithAddress(): boolean;

    actsWithPublicKey(): boolean;

    actsWithBip44Mnemonic(): boolean;

    actsWithBip44MnemonicWithEncryption(): boolean;

    actsWithAddressWithDerivationPath(): boolean;

    actsWithMnemonicWithEncryption(): boolean;

    actsWithSecret(): boolean;

    actsWithSecretWithEncryption(): boolean;

    isPrimary(): boolean;

    usesPassword(): boolean;

    signatoryFactory(): ISignatoryFactory;

    isSelected(): boolean;

    generateAlias(): string;

    tokens(): WalletTokenRepository;
}
