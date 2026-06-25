import { Signatories } from '@/lib/mainsail';

import { IReadWriteWallet, WalletData } from './contracts.js';
import { ISignatoryFactory, SignatoryInput } from './signatory.factory.contract.js';

export class SignatoryFactory implements ISignatoryFactory {
    readonly #wallet: IReadWriteWallet;

    public constructor(wallet: IReadWriteWallet) {
        this.#wallet = wallet;
    }

    public async make({
        encryptionPassword,
        mnemonic,
    }: SignatoryInput): Promise<Signatories.Signatory> {
        if (mnemonic) {
            return this.#wallet.signatory().mnemonic(mnemonic);
        }

        if (encryptionPassword) {
            return this.#wallet
                .signatory()
                .mnemonic(await this.#wallet.signingKey().get(encryptionPassword));
        }

        if (this.#wallet.isLedger()) {
            const derivationPath = this.#wallet.data().get(WalletData.DerivationPath);

            if (typeof derivationPath !== 'string') {
                throw new TypeError('[derivationPath] must be string.');
            }

            return this.#wallet.signatory().ledger(derivationPath, {
                senderPublicKey: this.#wallet.publicKey(),
                address: this.#wallet.address(),
            });
        }

        throw new Error('No signing key provided.');
    }

    public async fromSigningKeys(input?: {
        key?: string;
        encryptionPassword?: string;
    }): Promise<Signatories.Signatory> {
        const mnemonic = this.#wallet.actsWithMnemonic() ? input?.key : undefined;

        return this.make({
            mnemonic,
            encryptionPassword: input?.encryptionPassword,
        });
    }
}
