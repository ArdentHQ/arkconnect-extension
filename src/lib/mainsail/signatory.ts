import { IdentityOptions } from "./services";
import { ForbiddenMethodCallException } from "./exceptions";

export type SignatoryType =
	| "mnemonic"
	| "bip44Mnemonic"
	| "confirmationMnemonic"
	| "secret"
	| "confirmationSecret"
	| "ledger";

export interface SignatoryData {
	type: SignatoryType;
	signingKey: string;
	address?: string;
	publicKey?: string;
	confirmKey?: string;
	path?: string;
	options?: IdentityOptions;
}

// bip44 mnemonics and ledger paths are passed through untouched; passphrase
// and secret based keys are NFD-normalised to match BIP39 handling.
const isNormalised = (type: SignatoryType): boolean => type !== "bip44Mnemonic" && type !== "ledger";

// A single value object covering every way a transaction can be signed. The
// `type` discriminator replaces what used to be a class per signing method.
export class Signatory {
	readonly #data: SignatoryData;

	public constructor(data: SignatoryData) {
		this.#data = {
			...data,
			signingKey: isNormalised(data.type) ? data.signingKey.normalize("NFD") : data.signingKey,
			confirmKey: data.confirmKey?.normalize("NFD"),
		};
	}

	public signingKey(): string {
		return this.#data.signingKey;
	}

	public confirmKey(): string {
		if (this.#data.confirmKey === undefined) {
			throw new ForbiddenMethodCallException(this.constructor.name, this.confirmKey.name);
		}

		return this.#data.confirmKey;
	}

	public address(): string | undefined {
		return this.#data.address;
	}

	public publicKey(): string | undefined {
		return this.#data.publicKey;
	}

	public path(): string {
		if (this.#data.path === undefined) {
			throw new ForbiddenMethodCallException(this.constructor.name, this.path.name);
		}

		return this.#data.path;
	}

	public options(): IdentityOptions | undefined {
		return this.#data.options;
	}

	public actsWithMnemonic(): boolean {
		return this.#data.type === "mnemonic";
	}

	public actsWithBip44Mnemonic(): boolean {
		return this.#data.type === "bip44Mnemonic";
	}

	public actsWithConfirmationMnemonic(): boolean {
		return this.#data.type === "confirmationMnemonic";
	}

	public actsWithLedger(): boolean {
		return this.#data.type === "ledger";
	}

	public actsWithSecret(): boolean {
		return this.#data.type === "secret";
	}

	public actsWithConfirmationSecret(): boolean {
		return this.#data.type === "confirmationSecret";
	}
}
