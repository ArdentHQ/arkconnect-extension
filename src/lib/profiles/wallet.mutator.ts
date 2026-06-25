import { Services } from '@/lib/mainsail';

import {
    IReadWriteWallet,
    IWalletMutator,
    WalletData,
    WalletImportMethod,
    WalletSetting,
} from './contracts.js';
import { Avatar } from './helpers/avatar.js';
import { AddressService } from '@/lib/mainsail/address.service';

export class WalletMutator implements IWalletMutator {
    readonly #wallet: IReadWriteWallet;

    public constructor(wallet: IReadWriteWallet) {
        this.#wallet = wallet;
    }

    public async identity(mnemonic: string): Promise<void> {
        const { type, address, path } = new AddressService().fromMnemonic(mnemonic);

        /* istanbul ignore next */
        if (type) {
            this.#wallet.data().set(WalletData.DerivationType, type);
        }

        if (path) {
            this.#wallet.data().set(WalletData.DerivationPath, path);
        }

        if (type === 'bip39') {
            this.#wallet.data().set(WalletData.ImportMethod, WalletImportMethod.BIP39.MNEMONIC);
        }

        return this.address({ address, path, type });
    }

    public async address({
        address,
        path,
        type,
    }: Partial<Services.AddressDataTransferObject>): Promise<void> {
        return new Promise((resolve) => {
            if (type) {
                this.#wallet.data().set(WalletData.DerivationType, type);
            }

            if (path) {
                this.#wallet.data().set(WalletData.DerivationPath, path);
            }

            this.#wallet.data().set(WalletData.Address, address);

            this.avatar(this.#wallet.address());
            resolve();
        });
    }

    public avatar(value: string): void {
        const avatar: string = Avatar.make(value);

        this.#wallet.getAttributes().set('avatar', avatar);

        this.#wallet.settings().set(WalletSetting.Avatar, avatar);
    }

    public alias(alias: string): void {
        this.#wallet.settings().set(WalletSetting.Alias, alias);
    }

    public accountName(name: string): void {
        this.#wallet.settings().set(WalletSetting.AccountName, name);
    }

    public isSelected(isSelected: boolean) {
        this.#wallet.settings().set(WalletSetting.IsSelected, isSelected);
    }

    public async removeEncryption(password: string): Promise<void> {
        const importMethod = this.#wallet.importMethod();

        if (importMethod !== WalletImportMethod.BIP39.MNEMONIC_WITH_ENCRYPTION) {
            throw new Error(`Import method [${importMethod}] is not supported.`);
        }

        const isValid = await this.#verifyPassword(password);

        if (!isValid) {
            throw new Error('The provided password does not match the wallet.');
        }

        this.#wallet.signingKey().forget(password);

        this.#wallet.data().set(WalletData.ImportMethod, WalletImportMethod.BIP39.MNEMONIC);
    }

    async #verifyPassword(password: string): Promise<boolean> {
        try {
            const mnemonic = await this.#wallet.signingKey().get(password);
            const { address } = new AddressService().fromMnemonic(mnemonic);
            return this.#wallet.address() === address;
        } catch {
            /* istanbul ignore next */
            return false;
        }
    }
}
