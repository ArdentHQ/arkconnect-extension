import { Contracts, Services } from "@/lib/mainsail";

import { ClientService } from "@/lib/mainsail/client.service.js";

export class ValidatorSyncer {
	readonly #client: ClientService;

	public constructor(client: ClientService) {
		this.#client = client;
	}

	public async sync(query?: Contracts.KeyValuePair): Promise<Contracts.WalletData[]> {
		const result: Contracts.WalletData[] = [];

		const baseOptions: Services.ClientPagination = { ...(query ?? {}) };
		let options: Services.ClientPagination = { ...baseOptions };
		let lastResponse;

		do {
			lastResponse = await this.#client.validators(options);

			for (const item of lastResponse.items()) {
				result.push(item);
			}

			options = { ...baseOptions, cursor: lastResponse.nextPage() };
		} while (lastResponse.hasMorePages());

		return result;
	}
}
