import { BIP39, UUID } from '@ardenthq/arkvault-crypto';
import {
    IAddressOptions,
    IAddressWithDerivationPathOptions,
    IGenerateOptions,
    IMnemonicOptions,
    IProfile,
    IReadWriteWallet,
    IWalletFactory,
    WalletData,
    WalletImportMethod,
} from './contracts';
import { WalletFlag } from './wallet.enum';
import { Wallet } from './wallet';
import { PublicKeyService } from '@/lib/mainsail/public-key.service';
import { Contracts } from './index';
import { WalletAliasProvider } from './profile.wallet.alias';

export class WalletFactory implements IWalletFactory {
    readonly #profile: IProfile;

    public constructor(profile: IProfile) {
        this.#profile = profile;
    }

    public async generate({
        locale,
        wordCount,
        withPublicKey,
    }: IGenerateOptions): Promise<{ mnemonic: string; wallet: IReadWriteWallet }> {
        const mnemonic: string = BIP39.generate(locale, wordCount);

        const wallet = await this.fromMnemonicWithBIP39({ mnemonic });

        if (withPublicKey) {
            const value = new PublicKeyService().fromMnemonic(mnemonic);
            wallet.data().set(WalletData.PublicKey, value.publicKey);
        }

        return { mnemonic, wallet };
    }

    public async fromMnemonicWithBIP39({
        mnemonic,
        password,
    }: IMnemonicOptions): Promise<IReadWriteWallet> {
        const wallet: IReadWriteWallet = new Wallet(UUID.random(), {}, this.#profile);

        wallet.data().set(WalletData.ImportMethod, WalletImportMethod.BIP39.MNEMONIC);
        wallet.data().set(WalletData.Status, WalletFlag.Cold);

        await wallet.mutator().identity(mnemonic);

        if (password) {
            wallet
                .data()
                .set(WalletData.ImportMethod, WalletImportMethod.BIP39.MNEMONIC_WITH_ENCRYPTION);

            await wallet.signingKey().set(mnemonic, password);
        }

        return wallet;
    }

    public async fromAddress({ address }: IAddressOptions): Promise<IReadWriteWallet> {
        const wallet: IReadWriteWallet = new Wallet(UUID.random(), {}, this.#profile);
        wallet.data().set(WalletData.ImportMethod, WalletImportMethod.Address);
        wallet.data().set(WalletData.Status, WalletFlag.Cold);

        await wallet.mutator().address({ address });

        return wallet;
    }

    public async fromAddressWithDerivationPath({
        address,
        path,
    }: IAddressWithDerivationPathOptions): Promise<IReadWriteWallet> {
        const wallet: IReadWriteWallet = new Wallet(UUID.random(), {}, this.#profile);

        wallet.data().set(WalletData.ImportMethod, WalletImportMethod.BIP44.DERIVATION_PATH);
        wallet.data().set(WalletData.DerivationPath, path);
        wallet.data().set(WalletData.Status, WalletFlag.Cold);

        await wallet.mutator().address({ address });

        return wallet;
    }

    public generateAlias(wallet: Contracts.IReadWriteWallet, path?: string): string {
        return new WalletAliasProvider(this.#profile).generateAlias(wallet, path);
    }
}
