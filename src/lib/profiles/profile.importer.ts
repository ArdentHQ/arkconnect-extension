import { Base64 } from "@ardenthq/arkvault-crypto";

import { IProfile, IProfileData } from "./contracts.js";
import { ProfileEncrypter } from "./profile.encrypter";
import { ProfileValidator } from "./profile.validator";
import { Environment } from "./environment.js";
import { ProfileMainsailMigrator } from "./profile.mainsail-migrator.js";

export class ProfileImporter {
	readonly #profile: IProfile;
	readonly #validator: ProfileValidator;
	readonly #migrator: ProfileMainsailMigrator;
	#ignoreDetails: boolean = false;

	public constructor(profile: IProfile, _env: Environment) {
		this.#profile = profile;
		this.#validator = new ProfileValidator();
		this.#migrator = new ProfileMainsailMigrator();
	}

	public ignoreDetails(): ProfileImporter {
		this.#ignoreDetails = true;
		return this;
	}

	public async import(password?: string): Promise<void> {
		let data: IProfileData = await this.#unpack(password);

		data = await this.#migrator.migrate(this.#profile, data);

		data = this.#validator.validate(data);

		if (!this.#ignoreDetails) {
			this.#profile.data().fill(data.data);
			this.#profile.hosts().fill(data.hosts);
			this.#profile.networks().fill(data.networks);
			this.#profile.wallets().fill(data.wallets);
			this.#profile.exchangeRates().restore();
		}

		this.#profile.settings().fill(data.settings);
	}

	async #unpack(password?: string): Promise<IProfileData> {
		let data: IProfileData | undefined;
		let errorReason = "";

		try {
			if (typeof password === "string") {
				this.#profile.password().set(password);
				data = await new ProfileEncrypter(this.#profile).decrypt(password);
			} else {
				data = JSON.parse(Base64.decode(this.#profile.getAttributes().get<string>("data")));
			}
		} catch (error) {
			errorReason = ` Reason: ${(error as Error).message}`;
		}

		if (data === undefined) {
			throw new Error(`Failed to decode or decrypt the profile.${errorReason}`);
		}

		if (!data.data && !password) {
			throw new Error("PasswordRequired");
		}

		return data;
	}
}
