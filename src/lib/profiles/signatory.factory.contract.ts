import { Signatories } from "@/lib/mainsail";

export interface SignatoryInput {
	encryptionPassword?: string;
	mnemonic?: string;
	secret?: string;
}

export interface ISignatoryFactory {
	/**
	 * Get signatory based on input data.
	 *
	 * @param {SignatoryInput} input
	 * @memberof ISignatoryFactory
	 * @return {Services.SignatoryService}
	 */
	make(input: SignatoryInput): Promise<Signatories.Signatory>;
	/**
	 * Get signatory based on signing keys (mnemonic or secret).
	 *
	 * @param {SignatoryInput} input
	 * @memberof ISignatoryFactory
	 * @return {Services.SignatoryService}
	 */
	fromSigningKeys(input?: {
		key?: string;
		encryptionPassword?: string;
	}): Promise<Signatories.Signatory>;
}
