import { IProfile } from "./contracts.js";

export class CountAggregate implements CountAggregate {
	readonly #profile: IProfile;

	public constructor(profile: IProfile) {
		this.#profile = profile;
	}

	/** {@inheritDoc CountAggregate.wallets} */
	public wallets(): number {
		return this.#profile.wallets().count();
	}
}
