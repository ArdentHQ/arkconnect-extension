import { useEffect, useState } from 'react';
import { general } from '@/lib/data/general';

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
            const rates = await fetch(url);
            const parsedRates = await rates.json();

            setRates(parsedRates[coinId]);
            setLoading(false);
        };

        void getRates();
    }, []);

    return {
        rates,
        isLoading,
    };
};
