import { useEffect, useState } from 'react';
import { general } from '@/lib/data/general';
import { getLocalValues, setLocalValue } from '../utils/localStorage';

const ONE_MINUTE_IN_MS = 60000;

const MAX_COINGECKO_REQUESTS_PER_MINUTE =
  import.meta.env.VITE_MAX_COINGECKO_REQUESTS_PER_MINUTE ?? (10 as number);

export const useExchangeRates = () => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setLoading] = useState<boolean>(true);

  const coinId = 'ark';
  const coingeckoApiUrl = 'https://api.coingecko.com/api/v3/simple/price';

  useEffect(() => {
    const url = new URL(coingeckoApiUrl);
    url.searchParams.set('ids', coinId);
    url.searchParams.set(
      'vs_currencies',
      general.currencies.map((currency) => currency.value).join(','),
    );

    const getRates = async () => {
      const now = Date.now();

      const { ratesCache } = await getLocalValues();

      if (
        ratesCache !== undefined &&
        ratesCache.rates &&
        now - ratesCache.lastFetch < ONE_MINUTE_IN_MS
      ) {
        setRates(ratesCache.rates);
        setLoading(false);
      } else {
        const timeSinceLastFetch = now - (ratesCache?.lastFetch ?? 0);
        const minInterval = 60000 / MAX_COINGECKO_REQUESTS_PER_MINUTE; // Minimum time interval between requests
        if (timeSinceLastFetch < minInterval) {
          // Request throttled due to rate limit.
          return;
        }

        // Fetch new data
        const response = await fetch(url);
        const parsedRates = await response.json();

        const cache = {
          lastFetch: now,
          rates: parsedRates[coinId],
        };

        await setLocalValue('ratesCache', cache);

        setRates(parsedRates[coinId]);
        setLoading(false);
      }
    };

    void getRates();
  }, []);

  return {
    rates,
    isLoading,
  };
};
