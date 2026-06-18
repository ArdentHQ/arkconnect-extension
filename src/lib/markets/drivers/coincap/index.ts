import { DateTime } from '@/lib/intl';

import {
    DailyAverageOptions,
    HistoricalData,
    HistoricalPriceOptions,
    PriceTracker,
} from '@/lib/markets/contracts';

const convertToCurrency = (
    amount: number,
    {
        from,
        to,
        base,
        rates,
    }: { from: string; to: string; base: string; rates: Record<string, number> },
): number => {
    if (from && to) {
        const baseAmount = amount * 100;

        if (from === base && Object.prototype.hasOwnProperty.call(rates, to)) {
            return baseAmount * (rates[to] / 100);
        }

        if (to === base && Object.prototype.hasOwnProperty.call(rates, from)) {
            return baseAmount * (1 / rates[from] / 100);
        }

        if (
            Object.prototype.hasOwnProperty.call(rates, from) &&
            Object.prototype.hasOwnProperty.call(rates, to)
        ) {
            return baseAmount * ((rates[to] * (1 / rates[from])) / 100);
        }

        throw new Error('`rates` object does not contain either `from` or `to` currency!');
    }

    throw new Error('Please specify the `from` and/or `to` currency or use parsing!');
};

export class CoinCap implements PriceTracker {
    private readonly tokenLookup: Record<string, string> = {};
    readonly #host: string = 'https://api.coincap.io/v2';

    public async historicalPrice(options: HistoricalPriceOptions): Promise<HistoricalData> {
        const { tokenId, rates } = await this.#getCurrencyData(options.token);

        const daysSubtract = options.days === 24 ? 1 : options.days;
        const timeInterval = options.days === 24 ? 'h1' : 'h12';
        const startDate = DateTime.make().subDays(daysSubtract).valueOf();
        const endDate = DateTime.make().valueOf();

        const body = await this.#get(`assets/${tokenId}/history`, {
            end: endDate,
            interval: timeInterval,
            start: startDate,
        });

        const tokenIdUpper = tokenId.toUpperCase();
        const datasets: Record<string, number> = {};
        for (const value of body.data as Array<{ time: number; priceUsd: string }>) {
            datasets[DateTime.make(value.time).format(options.dateFormat)] = convertToCurrency(
                Number(value.priceUsd),
                {
                    base: tokenIdUpper,
                    from: options.currency,
                    rates,
                    to: tokenIdUpper,
                },
            );
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

        const start = DateTime.make(options.timestamp).startOf('day').valueOf();
        const end = DateTime.make(start).addDay().valueOf();

        const response = await this.#get(`assets/${tokenId}/history`, {
            end,
            interval: 'h1',
            start,
        });

        if (response.data.length === 0) {
            return 0;
        }

        const priceUsd =
            (response.data as Array<{ priceUsd: string }>).reduce(
                (acc: number, entry) => acc + Number(entry.priceUsd),
                0,
            ) / response.data.length;

        const { data } = await this.#get('rates');

        const rate = (data as Array<{ symbol: string; rateUsd: string }>).find(
            (r) => r.symbol === options.currency.toUpperCase(),
        );

        return priceUsd / Number(rate!.rateUsd);
    }

    async #getTokenId(token: string, limit = 1000): Promise<string> {
        if (Object.keys(this.tokenLookup).length > 0) {
            return this.tokenLookup[token.toUpperCase()];
        }

        const body = await this.#get('assets', { limit });

        for (const { symbol, id } of body.data as Array<{ symbol: string; id: string }>) {
            this.tokenLookup[symbol.toUpperCase()] = id;
        }

        return this.tokenLookup[token.toUpperCase()];
    }

    async #getCurrencyData(
        token: string,
    ): Promise<{ tokenId: string; rates: Record<string, number> }> {
        const tokenId = await this.#getTokenId(token);
        const [ratesBody, tokenBody] = await Promise.all([
            this.#get('rates'),
            this.#get(`assets/${tokenId}`),
        ]);
        const tokenData = tokenBody.data;

        const rates: Record<string, number> = {
            [tokenData.symbol.toUpperCase()]: Number(tokenData.priceUsd),
        };
        for (const value of ratesBody.data) {
            rates[value.symbol.toUpperCase()] = Number(value.rateUsd);
        }

        return { tokenId, rates };
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
