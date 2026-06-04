import { useMemo } from 'react';
import { general } from '@/lib/data/general';

interface OptionProperties {
    label: string;
    value: string | number;
    isSelected?: boolean;
}

interface OptionGroupProperties {
    title: string;
    options: OptionProperties[];
}

type UseCurrencyOptionsHook = (marketProvider?: string) => OptionGroupProperties[];

export const useCurrencyOptions: UseCurrencyOptionsHook = (marketProvider) => {
    return useMemo(() => {
        const allOptions = [
            { options: general.currencies, title: 'Fiat' },
            { options: general.crypto, title: 'Crypto' },
        ];

        const unsupportedCurrencies = general.marketProviders.find(
            (item) => item.value === marketProvider,
        )?.unsupportedCurrencies;

        if (!unsupportedCurrencies?.length) {
            return allOptions;
        }

        return allOptions.map(({ options, ...itemProperties }) => ({
            ...itemProperties,
            options: options.filter(({ value }) => !unsupportedCurrencies.includes(`${value}`)),
        }));
    }, [marketProvider]);
};
