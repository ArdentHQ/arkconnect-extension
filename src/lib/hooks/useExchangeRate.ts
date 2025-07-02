import { useCallback } from 'react';
import { useProfileContext } from '@/lib/context/Profile';
import { DateTime } from '@/lib/intl';

interface Input {
    ticker?: string;
    exchangeTicker?: string;
}

interface Output {
    convert: (value?: number) => number;
}

export const useExchangeRate = ({ ticker, exchangeTicker }: Input): Output => {
    const { profile } = useProfileContext();

    const convert = useCallback(
        (value?: number) => {
            if (!ticker || !exchangeTicker || !value) {
                return 0;
            }

            return profile.exchangeRates().exchange(ticker, exchangeTicker, DateTime.make(), value);
        },
        [profile, exchangeTicker, ticker],
    );

    return { convert };
};
