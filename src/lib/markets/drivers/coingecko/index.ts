import { DateTime } from '@/lib/intl';

import {
    DailyAverageOptions,
    HistoricalData,
    HistoricalPriceOptions,
    PriceTracker,
} from '@/lib/markets/contracts';

export class CoinGecko implements PriceTracker {
    private readonly tokenLookup: Record<string, string> = {};
    readonly #host: string = 'https://api.coingecko.com/api/v3';

    public async historicalPrice(options: HistoricalPriceOptions): Promise<HistoricalData> {
        const tokenId = await this.#getTokenId(options.token);

        const body = await this.#get(`coins/${tokenId}/market_chart`, {
            days: options.days,
            vs_currency: options.currency,
        });

        const datasets: Record<string, number> = {};
        for (let index = 0; index < body.prices.length; index += 24) {
            datasets[body.prices[index][0]] = body.prices[index][1];
        }

        const datasetValues: number[] = Object.values(datasets);

        return {
            datasets: datasetValues,
            labels: Object.keys(datasets).map((time) =>
                DateTime.make(time).format(options.dateFormat),
            ),
            max: Math.max(...datasetValues),
            min: Math.min(...datasetValues),
        };
    }

    public async dailyAverage(options: DailyAverageOptions): Promise<number> {
        const tokenId = await this.#getTokenId(options.token);

        const response = await this.#get(`coins/${tokenId}/history`, {
            date: DateTime.make(options.timestamp).format('DD-MM-YYYY'),
        });

        return response.market_data?.current_price[options.currency.toLowerCase()];
    }

    async #getTokenId(token: string): Promise<string> {
        if (Object.keys(this.tokenLookup).length > 0) {
            return this.tokenLookup[token.toUpperCase()];
        }

        const body = await this.#get('coins/list');

        for (const { symbol, id } of body as Array<{ symbol: string; id: string }>) {
            this.tokenLookup[symbol.toUpperCase()] = id;
        }

        return this.tokenLookup[token.toUpperCase()];
    }

    async #get(path: string, query: Record<string, any> = {}): Promise<any> {
        const url = new URL(`${this.#host}/${path}`);
        for (const [key, value] of Object.entries(query)) {
            if (value !== undefined) url.searchParams.set(key, String(value));
        }
        const response = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    }
}
