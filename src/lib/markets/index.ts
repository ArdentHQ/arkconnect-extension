import { HistoricalData, HistoricalPriceOptions, PriceTracker } from './contracts';
import { CoinCap } from './drivers/coincap';
import { CoinGecko } from './drivers/coingecko';
import { CryptoCompare } from './drivers/cryptocompare';

export class MarketService {
    #adapter: PriceTracker;

    public constructor(adapter: PriceTracker) {
        this.#adapter = adapter;
    }

    public static make(name: string): MarketService {
        return new MarketService(
            {
                coincap: new CoinCap(),
                coingecko: new CoinGecko(),
                cryptocompare: new CryptoCompare(),
            }[name.toLowerCase()] as PriceTracker,
        );
    }

    public async historicalPrice(options: HistoricalPriceOptions): Promise<HistoricalData> {
        return this.#adapter.historicalPrice(options);
    }

    public async dailyAverage(token: string, currency: string, timestamp: number): Promise<number> {
        return this.#adapter.dailyAverage({ currency, timestamp, token });
    }
}
