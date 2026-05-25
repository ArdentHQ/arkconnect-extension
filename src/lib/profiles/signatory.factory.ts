import { Signatories } from "@/lib/mainsail";

import { IReadWriteWallet, WalletData } from "./contracts.js";
import { ISignatoryFactory, SignatoryInput } from "./signatory.factory.contract.js";

export class SignatoryFactory implements ISignatoryFactory {
	readonly #wallet: IReadWriteWallet;

	public constructor(wallet: IReadWriteWallet) {
		this.#wallet = wallet;
	}

	public async make({ encryptionPassword, mnemonic, secret }: SignatoryInput): Promise<Signatories.Signatory> {
		if (mnemonic && this.#wallet.actsWithBip44Mnemonic()) {
			const derivationPath = this.#wallet.data().get(WalletData.DerivationPath);

			if (typeof derivationPath !== "string") {
				throw new TypeError("[derivationPath] must be string.");
			}

			return this.#wallet.signatory().bip44Mnemonic(mnemonic, derivationPath);
		}

		if (encryptionPassword && this.#wallet.actsWithBip44MnemonicWithEncryption()) {
			const derivationPath = this.#wallet.data().get(WalletData.DerivationPath);

			if (typeof derivationPath !== "string") {
				throw new TypeError("[derivationPath] must be string.");
			}

			const mnemonic = await this.#wallet.signingKey().get(encryptionPassword);

			return this.#wallet.signatory().bip44Mnemonic(mnemonic, derivationPath);
		}

		if (mnemonic) {
			return this.#wallet.signatory().mnemonic(mnemonic);
		}

		if (encryptionPassword) {
			if (this.#wallet.actsWithSecretWithEncryption()) {
				return this.#wallet.signatory().secret(await this.#wallet.signingKey().get(encryptionPassword));
			}

			return this.#wallet.signatory().mnemonic(await this.#wallet.signingKey().get(encryptionPassword));
		}

		if (this.#wallet.isLedger()) {
			const derivationPath = this.#wallet.data().get(WalletData.DerivationPath);

			if (typeof derivationPath !== "string") {
				throw new TypeError("[derivationPath] must be string.");
			}

			return this.#wallet
				.signatory()
				.ledger(derivationPath, { senderPublicKey: this.#wallet.publicKey(), address: this.#wallet.address() });
		}

		if (secret) {
			return this.#wallet.signatory().secret(secret);
		}

		throw new Error("No signing key provided.");
	}

	public async fromSigningKeys(input?: {
		key?: string;
		encryptionPassword?: string;
	}): Promise<Signatories.Signatory> {
		const mnemonic = this.#wallet.actsWithMnemonic() ? input?.key : undefined;
		const secret = this.#wallet.actsWithSecret() ? input?.key : undefined;

		return this.make({
			mnemonic,
			secret,
			encryptionPassword: input?.encryptionPassword,
		});
	}
}
