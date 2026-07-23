import { CURRENCIES, DateTime } from "@/lib/intl";

import {
	CurrentPriceOptions,
	DailyAverageOptions,
	HistoricalData,
	HistoricalPriceOptions,
	HistoricalVolumeOptions,
	MarketDataCollection,
	PriceTracker,
} from "@/lib/markets/contracts";
import { HistoricalPriceTransformer } from "./transformers/historical-price-transformer.js";
import { HistoricalVolumeTransformer } from "./transformers/historical-volume-transformer.js";
import { MarketTransformer } from "./transformers/market-transformer.js";

/**
 * Implements a price tracker through the ARK Pricing API.
 *
 * @see https://github.com/ArdentHQ/ark-pricing
 *
 * @export
 * @class PriceTracker
 * @implements {PriceTracker}
 */
export class ArkPricing implements PriceTracker {
	/**
	 * The host of the ARK Pricing API.
	 *
	 * @type {string}
	 * @memberof PriceTracker
	 */
	readonly #host: string = "https://pricing.ardenthq.com/api/v1";

	/** {@inheritDoc PriceTracker.verifyToken} */
	public async verifyToken(token: string): Promise<boolean> {
		try {
			const body = await this.#get(
				`coins/${token.toLowerCase()}/price`,
				this.#currenciesQuery(["USD"]),
			);

			return !!body.data;
		} catch {
			return false;
		}
	}

	/** {@inheritDoc PriceTracker.marketData} */
	public async marketData(token: string): Promise<MarketDataCollection> {
		const body = await this.#get(
			`coins/${token.toLowerCase()}/market`,
			this.#currenciesQuery(Object.keys(CURRENCIES)),
		);

		return new MarketTransformer(body.data ?? {}).transform();
	}

	/** {@inheritDoc PriceTracker.historicalPrice} */
	public async historicalPrice(options: HistoricalPriceOptions): Promise<HistoricalData> {
		const body = await this.#get(`coins/${options.token.toLowerCase()}/history`, {
			currency: options.currency,
			interval: options.type,
			limit: options.days,
		});

		return new HistoricalPriceTransformer(body.data.prices).transform(options);
	}

	/** {@inheritDoc PriceTracker.historicalVolume} */
	public async historicalVolume(options: HistoricalVolumeOptions): Promise<HistoricalData> {
		const body = await this.#get(`coins/${options.token.toLowerCase()}/history`, {
			currency: options.currency,
			interval: options.type,
			limit: options.days,
		});

		return new HistoricalVolumeTransformer(body.data.prices).transform(options);
	}

	/** {@inheritDoc PriceTracker.dailyAverage} */
	public async dailyAverage(options: DailyAverageOptions): Promise<number> {
		const body = await this.#get(`coins/${options.token.toLowerCase()}/average`, {
			currency: options.currency,
			date: DateTime.make(options.timestamp).format("YYYY-MM-DD"),
		});

		return body.data.average;
	}

	/** {@inheritDoc PriceTracker.currentPrice} */
	public async currentPrice(options: CurrentPriceOptions): Promise<number> {
		const body = await this.#get(
			`coins/${options.token.toLowerCase()}/price`,
			this.#currenciesQuery([options.currency]),
		);

		return body.data.prices[options.currency.toUpperCase()].price;
	}

	/**
	 * Builds an indexed query object so the currencies reach the API as an array.
	 *
	 * @param {string[]} currencies
	 * @returns {Record<string, string>}
	 * @memberof PriceTracker
	 */
	#currenciesQuery(currencies: string[]): Record<string, string> {
		const query: Record<string, string> = {};

		for (const [index, currency] of currencies.entries()) {
			query[`currencies[${index}]`] = currency.toUpperCase();
		}

		return query;
	}

	/**
	 * Sends an HTTP GET request to the ARK Pricing API.
	 *
	 * @param {string} path
	 * @param {Record<string, any>} query
	 * @returns {Promise<any>}
	 * @memberof PriceTracker
	 */
	async #get(path: string, query: Record<string, any> = {}): Promise<any> {
		const url = new URL(`${this.#host}/${path}`);
		for (const [key, value] of Object.entries(query)) {
			if (value !== undefined) url.searchParams.set(key, String(value));
		}
		const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}
		return response.json();
	}
}
