import { useCallback } from 'react';
import { DateTime } from '@/app/lib/intl';

import { IProfile } from '@/app/lib/profiles/contracts';
import { BigNumber } from '@/app/lib/helpers';

interface Input {
    ticker?: string;
    exchangeTicker?: string;
    profile: IProfile;
}

interface Output {
    convert: (value?: number | string | BigNumber) => BigNumber;
}

export const useExchangeRate = ({ profile, ticker, exchangeTicker }: Input): Output => {
    const convert = useCallback(
        (value?: number | string | BigNumber) => {
            if (!ticker || !exchangeTicker || !value) {
                return BigNumber.ZERO;
            }

            return profile
                .exchangeRates()
                .exchange(ticker, exchangeTicker, DateTime.make(), BigNumber.make(value));
        },
        [exchangeTicker, ticker],
    );

    return { convert };
};
