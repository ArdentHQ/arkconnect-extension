import { Helpers } from '@ardenthq/sdk-profiles';

const formatCurrency = (
    value: number,
    ticker: string,
    options?: {
        locale?: string;
        withTicker?: boolean;
    },
) => {
    return Helpers.Currency.format(value, ticker, {
        ...options,
        locale: options?.locale ?? 'en-US',
    });
};

export default formatCurrency;
