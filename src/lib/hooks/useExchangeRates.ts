import { useEffect, useState } from 'react';
import { getLocalValues, setLocalValue } from '@/lib/utils/localStorage';
import { general } from '@/lib/data/general';

const ONE_MINUTE_IN_MS = 60000;
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
            const { ratesCache } = await getLocalValues();

            if (ratesCache === undefined || now - ratesCache.lastFetch >= ONE_MINUTE_IN_MS) {
                const rates = await fetchRates();

                await setLocalValue('ratesCache', {
                    lastFetch: now,
                    rates: rates,
                });

                setRates(rates);
            } else {
                setRates(ratesCache.rates);
            }

            setLoading(false);
        };

        void getRates();
    }, []);

    return {
        rates,
        isLoading,
    };
};
