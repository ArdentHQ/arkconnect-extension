import { Helpers } from '@ardenthq/sdk-profiles';

const formatCurrency = (
    value: number,
    ticker: string,
    options?: {
        withTicker?: boolean;
    },
) => {
    const locale = navigator.languages ? navigator.languages[0] : navigator.language ?? 'en-US';

    return Helpers.Currency.format(value, ticker, {
        ...options,
        locale,
    });
};

export default formatCurrency;
