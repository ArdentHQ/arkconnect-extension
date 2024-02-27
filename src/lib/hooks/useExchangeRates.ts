import { useEffect, useState } from 'react';
import { general } from '@/lib/data/general';
import { getLocalValues, setLocalValue } from '../utils/localStorage';

const ONE_MINUTE_IN_MS = 60000;
const MAX_COINGECKO_REQUESTS_PER_MINUTE =
  import.meta.env.VITE_MAX_COINGECKO_REQUESTS_PER_MINUTE ?? 10;
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const COIN_ID = 'ark';

const fetchRates = async () => {
  const url = new URL(COINGECKO_API_URL);
  url.searchParams.set('ids', COIN_ID);
  url.searchParams.set(
    'vs_currencies',
    general.currencies.map((currency) => currency.value).join(','),
  );

  const response = await fetch(url);
  const parsedRates = await response.json();
  return parsedRates[COIN_ID];
};

export const useExchangeRates = () => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getRates = async () => {
      const now = Date.now();
      let { ratesCache } = await getLocalValues();

      if (!ratesCache) {
        ratesCache = { lastFetch: 0, rates: {}, requestCount: 0 };
      }

      if (now - ratesCache.lastFetch < ONE_MINUTE_IN_MS) {
        if (ratesCache.requestCount < MAX_COINGECKO_REQUESTS_PER_MINUTE) {
          ratesCache.rates = await fetchRates();
          ratesCache.requestCount += 1;
        } else {
          // If MAX_COINGECKO_REQUESTS_PER_MINUTE is reached, use cached rates
          setRates(ratesCache.rates);
          setLoading(false);
          return;
        }
      } else {
        ratesCache.lastFetch = now;
        ratesCache.rates = await fetchRates();
        ratesCache.requestCount = 1;
      }

      await setLocalValue('ratesCache', ratesCache);

      setRates(ratesCache.rates);
      setLoading(false);
    };

    void getRates();
  }, []);

  return {
    rates,
    isLoading,
  };
};
