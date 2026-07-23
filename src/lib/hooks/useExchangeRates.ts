import { useEffect, useState } from 'react';
import { BigNumber } from '../helpers';
import { getLocalValues, setLocalValue } from '@/lib/utils/localStorage';
import { general } from '@/lib/data/general';

const ONE_MINUTE_IN_MS = 60000;
const ARK_PRICING_API_URL = 'https://pricing.ardenthq.com/api/v1';
const COIN_ID = 'ark';

const fetchRates = async (): Promise<Record<string, number>> => {
    const url = new URL(`${ARK_PRICING_API_URL}/coins/${COIN_ID}/price`);
    for (const [index, currency] of general.currencies.entries()) {
        url.searchParams.set(`currencies[${index}]`, currency.value);
    }

    const response = await fetch(url);
    const { data } = await response.json();

    return Object.entries(data?.prices ?? {}).reduce(
        (acc: Record<string, number>, [currency, value]: [string, any]) => {
            acc[currency.toLowerCase()] = value.price;

            return acc;
        },
        {},
    );
};

export const useExchangeRates = () => {
    const [rates, setRates] = useState<Record<string, BigNumber>>({});
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

                setRates(
                    Object.entries(rates).reduce(
                        (acc: Record<string, BigNumber>, [currency, value]) => {
                            acc[currency] = BigNumber.make(value);

                            return acc;
                        },
                        {},
                    ),
                );
            } else {
                setRates(
                    Object.entries(ratesCache.rates).reduce(
                        (acc: Record<string, BigNumber>, [currency, value]) => {
                            acc[currency] = BigNumber.make(value);

                            return acc;
                        },
                        {},
                    ),
                );
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
