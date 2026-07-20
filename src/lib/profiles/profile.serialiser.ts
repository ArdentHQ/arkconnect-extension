/* eslint unicorn/no-abusive-eslint-disable: "off" */
/* eslint-disable */
import { IProfile, IProfileData, IProfileSerialiser } from "./contracts.js";

export class ProfileSerialiser implements IProfileSerialiser {
	readonly #profile: IProfile;

	public constructor(profile: IProfile) {
		this.#profile = profile;
	}

	/** {@inheritDoc IProfileSerialiser.toJSON} */
	public toJSON(): IProfileData {
		return {
			data: this.#profile.data().all(),
			hosts: this.#profile.hosts().all(),
			id: this.#profile.id(),
			networks: this.#profile.networks().all(),
			settings: this.#profile.settings().all(),
			wallets: this.#profile.wallets().toObject(),
		};
	}
}
