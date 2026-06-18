import { DateTime } from '@/lib/intl';

import {
    DailyAverageOptions,
    HistoricalData,
    HistoricalPriceOptions,
    PriceTracker,
} from '@/lib/markets/contracts';

export class CryptoCompare implements PriceTracker {
    readonly #host: string = 'https://min-api.cryptocompare.com';

    public async historicalPrice(options: HistoricalPriceOptions): Promise<HistoricalData> {
        const body = await this.#get(`data/v2/histo${options.type}`, {
            fsym: options.token,
            limit: options.days,
            toTs: Math.round(Date.now() / 1000),
            tsym: options.currency,
        });

        const datasets = (body.Data.Data as Array<{ close: number; time: number }>).map(
            (value) => value.close,
        );

        return {
            datasets,
            labels: (body.Data.Data as Array<{ close: number; time: number }>).map((value) =>
                DateTime.make(value.time * 1000).format(options.dateFormat),
            ),
            max: Math.max(...datasets),
            min: Math.min(...datasets),
        };
    }

    public async dailyAverage(options: DailyAverageOptions): Promise<number> {
        const response = await this.#get(`data/dayAvg`, {
            fsym: options.token,
            toTs: DateTime.make(options.timestamp).toUNIX(),
            tsym: options.currency,
        });

        return response[options.currency.toUpperCase()];
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
