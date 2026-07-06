import { Services } from '@/lib/mainsail';

import { IReadWriteWallet } from './wallet.contract.js';

export class WalletIdentifierFactory {
    public static make(wallet: IReadWriteWallet): Services.WalletIdentifier {
        if (wallet.actsWithAddress() || wallet.isLedger() || wallet.actsWithMnemonic()) {
            return this.#address(wallet);
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
}
