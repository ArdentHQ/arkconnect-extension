import { useCallback } from 'react';
import { BigNumber, NumberLike } from '../helpers';
import { useProfileContext } from '@/lib/context/Profile';
import { DateTime } from '@/lib/intl';

interface Input {
    ticker?: string;
    exchangeTicker?: string;
}

interface Output {
    convert: (value?: NumberLike) => BigNumber;
}

export const useExchangeRate = ({ ticker, exchangeTicker }: Input): Output => {
    const { profile } = useProfileContext();

    const convert = useCallback(
        (value?: NumberLike) => {
            if (!ticker || !exchangeTicker || !value) {
                return BigNumber.ZERO;
            }

            return profile.exchangeRates().exchange(ticker, exchangeTicker, DateTime.make(), value);
        },
        [profile, exchangeTicker, ticker],
    );

    return { convert };
};
