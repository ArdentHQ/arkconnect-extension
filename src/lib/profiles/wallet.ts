import { Contracts, Networks, Services } from '@/lib/mainsail';
import { BigNumber } from '@/lib/helpers';
import { DateTime } from '@/lib/intl';

import {
    IDataRepository,
    IProfile,
    IReadWriteWallet,
    IReadWriteWalletAttributes,
    ISettingRepository,
    ISignatoryFactory,
    ITransactionIndex,
    ITransactionService,
    IVoteRegistry,
    IWalletData,
    IWalletImportFormat,
    IWalletMutator,
    IWalletSynchroniser,
    ProfileSetting,
    WalletData,
    WalletFlag,
    WalletImportMethod,
    WalletSetting,
} from './contracts';
import { DataRepository } from './data.repository';
import { AttributeBag } from './helpers/attribute-bag';
import { WalletSerialiser } from './serialiser';
import { SettingRepository } from './setting.repository';
import { SignatoryFactory } from './signatory.factory';
import { TransactionIndex } from './transaction-index';
import { VoteRegistry } from './vote-registry';
import { WalletBalanceType, WalletDerivationMethod } from './wallet.contract';
import { WalletMutator } from './wallet.mutator';
import { WalletSynchroniser } from './wallet.synchroniser';
import { TransactionService as WalletTransactionService } from './wallet-transaction.service';
import { WalletImportFormat } from './wif';
import { LinkService } from '@/lib/mainsail/link.service';
import { MessageService } from '@/lib/mainsail/message.service';
import { Manifest } from '@/lib/mainsail/manifest.class';
import { manifest } from '@/lib/mainsail/index';
import { LedgerService } from '@/lib/mainsail/ledger.service';
import { ClientService } from '@/lib/mainsail/client.service';
import { AddressService } from '@/lib/mainsail/address.service';
import { SignatoryService } from '@/lib/mainsail/signatory.service';
import { TransactionService } from '@/lib/mainsail/transaction.service';
import { ValidatorService } from './validator.service';
import { ExchangeRateService } from './exchange-rate.service';
import { WalletAliasProvider } from './profile.wallet.alias';
import { WalletTokenRepository } from './wallet-token.repository';

const ERR_NOT_SYNCED =
    'This wallet has not been synchronized yet. Please call [synchroniser().identity()] before using it.';

export class Wallet implements IReadWriteWallet {
    readonly #profile: IProfile;
    readonly #attributes: AttributeBag<IReadWriteWalletAttributes> = new AttributeBag();
    readonly #dataRepository: IDataRepository;
    readonly #settingRepository: ISettingRepository;
    readonly #transactionService: ITransactionService;
    readonly #walletSynchroniser: IWalletSynchroniser;
    readonly #walletMutator: IWalletMutator;
    readonly #voteRegistry: IVoteRegistry;
    readonly #transactionIndex: ITransactionIndex;
    readonly #signingKey: IWalletImportFormat;
    readonly #confirmKey: IWalletImportFormat;
    readonly #signatoryFactory: ISignatoryFactory;
    readonly #messageService: MessageService;
    readonly #ledgerService: LedgerService;
    readonly #tokens: WalletTokenRepository;

    public constructor(id: string, initialState: any, profile: IProfile) {
        this.#profile = profile;
        this.#attributes = new AttributeBag<IReadWriteWalletAttributes>({
            id,
            initialState,
            restorationState: { full: false, partial: false },
        });

        this.#dataRepository = new DataRepository();
        this.#settingRepository = new SettingRepository(profile, Object.values(WalletSetting));
        this.#transactionService = new WalletTransactionService(this);
        this.#walletSynchroniser = new WalletSynchroniser(this);
        this.#walletMutator = new WalletMutator(this);
        this.#voteRegistry = new VoteRegistry(this, this.#attributes, this.#profile);
        this.#transactionIndex = new TransactionIndex(this);
        this.#signingKey = new WalletImportFormat(this, WalletData.EncryptedSigningKey);
        this.#confirmKey = new WalletImportFormat(this, WalletData.EncryptedConfirmKey);
        this.#signatoryFactory = new SignatoryFactory(this);
        this.#messageService = new MessageService();
        this.#ledgerService = profile.ledger();
        this.#tokens = new WalletTokenRepository(profile.activeNetwork(), profile);

        this.#restore();
    }

    public profile(): IProfile {
        return this.#profile;
    }

    public id(): string {
        return this.#attributes.get('id');
    }

    public network(): Networks.Network {
        return this.profile().activeNetwork();
    }

    public currency(): string {
        return this.network().ticker();
    }

    public exchangeCurrency(): string {
        return this.#profile.settings().get(ProfileSetting.ExchangeCurrency) as string;
    }

    public alias(): string | undefined {
        return (
            new WalletAliasProvider(this.#profile).findAliasByAddress(
                this.address(),
                this.network().id(),
            ) ?? this.address()
        );
    }

    public accountName(): string | undefined {
        return this.settings().get(WalletSetting.AccountName);
    }

    public displayName(): string | undefined {
        return this.settings().get(WalletSetting.Alias) || this.username();
    }

    public primaryKey(): string {
        if (!this.#attributes.get<Contracts.WalletData>('wallet')) {
            throw new Error(ERR_NOT_SYNCED);
        }

        return this.#attributes.get<Contracts.WalletData>('wallet').primaryKey();
    }

    public importMethod(): string {
        return this.data().get(WalletData.ImportMethod)!;
    }

    public derivationMethod(): WalletDerivationMethod {
        return this.data().get(WalletData.DerivationType)!;
    }

    public address(): string {
        return this.data().get(WalletData.Address)!;
    }

    public publicKey(): string | undefined {
        return this.data().get(WalletData.PublicKey);
    }

    public balance(type: WalletBalanceType = 'available'): BigNumber {
        const value: Contracts.WalletBalance | undefined = this.data().get(WalletData.Balance);

        if (value && value[type]) {
            return BigNumber.make(value[type] as BigNumber, this.#decimals()).divide(
                BigNumber.powerOfTen(this.#decimals()),
            );
        }

        return BigNumber.ZERO;
    }

    public convertedBalance(type: WalletBalanceType = 'available'): BigNumber {
        if (this.network().isTest()) {
            return BigNumber.ZERO;
        }

        return this.exchangeRates().exchange(
            this.currency(),
            this.exchangeCurrency(),
            DateTime.make(),
            this.balance(type),
        );
    }

    public nonce(): BigNumber {
        const value: string | undefined = this.data().get(WalletData.Sequence);

        if (value === undefined) {
            return BigNumber.ZERO;
        }

        return BigNumber.make(value, this.#decimals());
    }

    public avatar(): string {
        const value: string | undefined = this.data().get(WalletSetting.Avatar);

        if (value) {
            return value;
        }

        return this.#attributes.get<string>('avatar');
    }

    public hasSyncedWithNetwork(): boolean {
        const wallet: Contracts.WalletData | undefined =
            this.#attributes.get<Contracts.WalletData>('wallet');

        if (wallet === undefined) {
            return false;
        }

        return wallet.hasPassed();
    }

    public data(): IDataRepository {
        return this.#dataRepository;
    }

    public settings(): ISettingRepository {
        return this.#settingRepository;
    }

    public toData(): Contracts.WalletData {
        if (!this.#attributes.get<Contracts.WalletData>('wallet')) {
            throw new Error(ERR_NOT_SYNCED);
        }

        return this.#attributes.get<Contracts.WalletData>('wallet');
    }

    public toObject(): IWalletData {
        return new WalletSerialiser(this).toJSON();
    }

    public tokenCount(): number {
        return this.data().get(WalletData.TokenCount, 0) as number;
    }

    public username(): string | undefined {
        if (this.isCold()) {
            return;
        }

        const attributes = this.#attributes.get<Contracts.WalletData>('wallet');

        if (!attributes) {
            throw new Error(ERR_NOT_SYNCED);
        }

        return attributes.username();
    }

    public validatorPublicKey(): string | undefined {
        if (!this.#attributes.get<Contracts.WalletData>('wallet')) {
            throw new Error(ERR_NOT_SYNCED);
        }

        return this.#attributes.get<Contracts.WalletData>('wallet').validatorPublicKey();
    }

    public isValidator(): boolean {
        if (!this.#attributes.get<Contracts.WalletData>('wallet')) {
            throw new Error(ERR_NOT_SYNCED);
        }

        return this.#attributes.get<Contracts.WalletData>('wallet').isValidator();
    }

    public isLegacyValidator(): boolean {
        if (!this.#attributes.get<Contracts.WalletData>('wallet')) {
            throw new Error(ERR_NOT_SYNCED);
        }

        return this.#attributes.get<Contracts.WalletData>('wallet').isLegacyValidator();
    }

    public isResignedValidator(): boolean {
        if (!this.#attributes.get<Contracts.WalletData>('wallet')) {
            throw new Error(ERR_NOT_SYNCED);
        }

        return this.#attributes.get<Contracts.WalletData>('wallet').isResignedValidator();
    }

    public isHDWallet(): boolean {
        return (
            this.data().get(WalletData.DerivationPath) !== undefined &&
            this.data().get(WalletData.AddressIndex) !== undefined
        );
    }

    public isLedger(): boolean {
        return this.data().get(WalletData.DerivationPath) !== undefined && !this.isHDWallet();
    }

    public isStarred(): boolean {
        return this.data().get(WalletFlag.Starred) === true;
    }

    public isCold(): boolean {
        return this.data().get(WalletData.Status) === WalletFlag.Cold;
    }

    public networkId(): string {
        return this.network().id();
    }

    public manifest(): Manifest {
        return new Manifest(manifest);
    }

    public client(): ClientService {
        return new ClientService({
            config: this.network().config(),
            profile: this.profile(),
        });
    }

    public addressService(): AddressService {
        return new AddressService();
    }

    public ledger(): LedgerService {
        return this.#ledgerService;
    }

    public link(): Services.LinkService {
        return new LinkService({
            config: this.network().config(),
            profile: this.#profile,
        });
    }

    public message(): MessageService {
        return this.#messageService;
    }

    public signatory(): SignatoryService {
        return new SignatoryService();
    }

    public transaction(): ITransactionService {
        return this.#transactionService;
    }

    public transactionService(): TransactionService {
        return new TransactionService({
            config: this.network().config(),
            profile: this.profile(),
        });
    }

    public synchroniser(): IWalletSynchroniser {
        return this.#walletSynchroniser;
    }

    public mutator(): IWalletMutator {
        return this.#walletMutator;
    }

    public voting(): IVoteRegistry {
        return this.#voteRegistry;
    }

    public transactionIndex(): ITransactionIndex {
        return this.#transactionIndex;
    }

    public signingKey(): IWalletImportFormat {
        return this.#signingKey;
    }

    public confirmKey(): IWalletImportFormat {
        return this.#confirmKey;
    }

    public explorerLink(): string {
        return this.link().wallet(this.address());
    }

    public markAsFullyRestored(): void {
        this.#attributes.forget('isMissingNetwork');

        this.#attributes.set('restorationState', {
            full: true,
            partial: false,
        });
    }

    public markAsPartiallyRestored(): void {
        this.#attributes.set('restorationState', {
            full: false,
            partial: true,
        });
    }

    public hasBeenPartiallyRestored(): boolean {
        return this.#attributes.get('restorationState').partial;
    }

    public getAttributes(): AttributeBag<IReadWriteWalletAttributes> {
        return this.#attributes;
    }

    public canVote(): boolean {
        return this.voting().available() > 0;
    }

    public canWrite(): boolean {
        if (this.actsWithAddress()) {
            return false;
        }

        if (this.actsWithPublicKey()) {
            return false;
        }

        return true;
    }

    public actsWithMnemonic(): boolean {
        return [
            WalletImportMethod.BIP39.MNEMONIC,
            WalletImportMethod.BIP44.MNEMONIC,
            WalletImportMethod.BIP49.MNEMONIC,
            WalletImportMethod.BIP84.MNEMONIC,
        ].includes(this.data().get(WalletData.ImportMethod)!);
    }

    public actsWithAddress(): boolean {
        return this.data().get(WalletData.ImportMethod) === WalletImportMethod.Address;
    }

    public actsWithPublicKey(): boolean {
        return this.data().get(WalletData.ImportMethod) === WalletImportMethod.PublicKey;
    }

    public actsWithBip44Mnemonic(): boolean {
        return this.data().get(WalletData.ImportMethod) === WalletImportMethod.BIP44.MNEMONIC;
    }

    public actsWithBip44MnemonicWithEncryption(): boolean {
        return (
            this.data().get(WalletData.ImportMethod) ===
            WalletImportMethod.BIP44.MNEMONIC_WITH_ENCRYPTION
        );
    }

    public actsWithAddressWithDerivationPath(): boolean {
        return [
            WalletImportMethod.BIP44.DERIVATION_PATH,
            WalletImportMethod.BIP49.DERIVATION_PATH,
            WalletImportMethod.BIP84.DERIVATION_PATH,
        ].includes(this.data().get(WalletData.ImportMethod)!);
    }

    public actsWithMnemonicWithEncryption(): boolean {
        return [
            WalletImportMethod.BIP39.MNEMONIC_WITH_ENCRYPTION,
            WalletImportMethod.BIP44.MNEMONIC_WITH_ENCRYPTION,
            WalletImportMethod.BIP49.MNEMONIC_WITH_ENCRYPTION,
            WalletImportMethod.BIP84.MNEMONIC_WITH_ENCRYPTION,
        ].includes(this.data().get(WalletData.ImportMethod)!);
    }

    public isSelected(): boolean {
        return this.settings().get(WalletSetting.IsSelected) === true;
    }

    public actsWithSecret(): boolean {
        return this.data().get(WalletData.ImportMethod) === WalletImportMethod.SECRET;
    }

    public actsWithSecretWithEncryption(): boolean {
        return (
            this.data().get(WalletData.ImportMethod) === WalletImportMethod.SECRET_WITH_ENCRYPTION
        );
    }

    public isPrimary(): boolean {
        return this.data().get(WalletData.IsPrimary) === true;
    }

    public usesPassword(): boolean {
        return this.signingKey().exists();
    }

    public signatoryFactory(): ISignatoryFactory {
        return this.#signatoryFactory;
    }

    public validators(): ValidatorService {
        return this.#profile.validators();
    }

    #restore(): void {
        const balance: Contracts.WalletBalance | undefined =
            this.data().get<Contracts.WalletBalance>(WalletData.Balance);

        /* istanbul ignore next */
        this.data().set(WalletData.Balance, {
            available: BigNumber.make(balance?.available || 0, this.#decimals()),
            fees: BigNumber.make(balance?.fees || 0, this.#decimals()),
        });

        this.data().set(
            WalletData.Sequence,
            BigNumber.make(
                this.data().get<string>(WalletData.Sequence) || BigNumber.ZERO,
                this.#decimals(),
            ),
        );
    }

    #decimals(): number {
        try {
            const manifest: Networks.NetworkManifest =
                this.manifest().get<object>('networks')[this.networkId()];
            return manifest.currency.decimals ?? 18;
        } catch {
            return 18;
        }
    }

    public exchangeRates(): ExchangeRateService {
        return this.#profile.exchangeRates();
    }

    public tokens(): WalletTokenRepository {
        return this.#tokens;
    }
}
