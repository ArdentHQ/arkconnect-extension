import { Services } from '@/lib/mainsail';

import { IReadWriteWallet } from './wallet.contract.js';

export class WalletIdentifierFactory {
    public static make(wallet: IReadWriteWallet): Services.WalletIdentifier {
        if (wallet.actsWithAddress() || wallet.isLedger()) {
            return this.#address(wallet);
        }

        if (wallet.actsWithMnemonic()) {
            return this.#addressOrPublicKey(wallet);
        }

        throw new Error(`Unsupported import method ${wallet.importMethod()}`);
    }

    static #address(wallet: IReadWriteWallet): Services.WalletIdentifier {
        return {
            method: wallet.derivationMethod(),
            type: 'address',
            value: wallet.address(),
        };
    }

    static #extendedPublicKey(wallet: IReadWriteWallet): Services.WalletIdentifier {
        return {
            method: wallet.derivationMethod(),
            type: 'extendedPublicKey',
            value: wallet.publicKey()!,
        };
    }

    static #addressOrPublicKey(wallet: IReadWriteWallet): Services.WalletIdentifier {
        if (wallet.network().usesExtendedPublicKey()) {
            return this.#extendedPublicKey(wallet);
        }

        return this.#address(wallet);
    }
}
