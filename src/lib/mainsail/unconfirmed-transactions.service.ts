import { ClientService } from "./client.service.js";
import type { ConfigRepository } from "@/lib/mainsail";
import type { IProfile } from "@/lib/profiles/profile.contract";
import { Cache } from "@/lib/mainsail/cache";

export class UnconfirmedTransactionsService {
	#config: ConfigRepository;
	#profile: IProfile;
	#client: ClientService;
	#cache: Cache;

	constructor({ config, profile, ttl = 8 }: { config: ConfigRepository; profile: IProfile; ttl?: number }) {
		this.#config = config;
		this.#profile = profile;
		this.#client = new ClientService({ config: this.#config, profile: this.#profile });
		this.#cache = new Cache(ttl);
	}

	async listUnconfirmed(parameters?: { page?: number; limit?: number; address?: string[] }) {
		const requestParams: Record<string, unknown> = {};

		if (parameters?.address && parameters.address.length > 0) {
			requestParams.address = parameters.address.join(",");
		}

		if (parameters?.page !== undefined) {
			requestParams.page = parameters.page;
		}

		const limit = parameters?.limit;

		const cacheKey = `${requestParams.address}`;
		const response = await this.#cache.remember(
			cacheKey,
			async () =>
				await this.#client.unconfirmedTransactions({
					limit,
					...requestParams,
				}),
		);

		const results = response.items() ?? [];
		return { results };
	}
}
