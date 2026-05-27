/* istanbul ignore file */

import { IdentityOptions } from "@/lib/mainsail/shared.contract";

import { AddressService } from "./address.service";
import { PublicKeyService } from "./public-key.service";
import { Signatory } from "./signatory";

export class SignatoryService {
	readonly #addressService: AddressService;
	readonly #publicKeyService: PublicKeyService;

	public constructor() {
		this.#addressService = new AddressService();
		this.#publicKeyService = new PublicKeyService();
	}

	public async mnemonic(mnemonic: string, options?: IdentityOptions): Promise<Signatory> {
		return new Signatory({
			type: "mnemonic",
			signingKey: mnemonic,
			address: this.#addressService.fromMnemonic(mnemonic).address,
			publicKey: this.#publicKeyService.fromMnemonic(mnemonic).publicKey,
			options,
		});
	}

	public async bip44Mnemonic(mnemonic: string, path: string): Promise<Signatory> {
		return new Signatory({ type: "bip44Mnemonic", signingKey: mnemonic, path });
	}

	public async ledger(path: string, options?: IdentityOptions): Promise<Signatory> {
		return new Signatory({
			type: "ledger",
			signingKey: path,
			path,
			address: options?.address,
			publicKey: options?.senderPublicKey,
			options,
		});
	}

	public async secret(secret: string, options?: IdentityOptions): Promise<Signatory> {
		return new Signatory({
			type: "secret",
			signingKey: secret,
			address: this.#addressService.fromSecret(secret).address,
			publicKey: this.#publicKeyService.fromSecret(secret).publicKey,
			options,
		});
	}

	/**
	 * This signatory should only be used for testing and fee calculations.
	 */
	public async stub(mnemonic: string): Promise<Signatory> {
		return new Signatory({
			type: "mnemonic",
			signingKey: mnemonic,
			address: "address",
			publicKey: "publicKey",
		});
	}
}
