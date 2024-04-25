import { Helpers } from '@ardenthq/sdk-profiles';
import { TippyProps } from '@tippyjs/react';
import cn from 'classnames';
import constants from '@/constants';
import cropToMaxDigits from '@/lib/utils/cropToMaxDigits';
import { Tooltip } from '@/shared/components';

interface AmountProperties {
    ticker: string;
    value: number;
    showSign?: boolean;
    withTicker?: boolean;
    isNegative?: boolean;
    maxDigits?: number;
    tooltipPlacement?: TippyProps['placement'];
    underlineOnHover?: boolean;
    maxDecimals?: number;
    displayTooltip?: boolean;
}

const Amount = ({
    value,
    ticker,
    withTicker = true,
    isNegative,
    showSign,
    maxDigits = constants.MAX_CURRENCY_DIGITS_ALLOWED,
    tooltipPlacement = 'top',
    underlineOnHover = false,
    maxDecimals,
    displayTooltip = true,
}: AmountProperties) => {
    const actualFormattedAmount = Helpers.Currency.format(value, ticker, { withTicker });

    let formattedAmount = cropToMaxDigits({
        value,
        ticker,
        maxDigits,
        withTicker,
        maxDecimals,
    });

    if (value === 0 && !['ARK', 'DARK'].includes(formattedAmount.split(' ')[1])) {
        const currencySymbol = formattedAmount.match(/[^\d.,]+/);
        formattedAmount = `${currencySymbol}0.00`;
    } else if (showSign) {
        if (value !== 0) {
            formattedAmount = `${isNegative ? '-' : '+'}${formattedAmount}`;
        }
    }

    const tooltipDisabled = formattedAmount === actualFormattedAmount || !displayTooltip;

    return (
        <Tooltip
            disabled={tooltipDisabled}
            content={actualFormattedAmount}
            placement={tooltipPlacement}
        >
            <span
                className={cn({
                    'underline-offset-2 hover:underline': !tooltipDisabled && underlineOnHover,
                })}
            >
                {formattedAmount}
            </span>
        </Tooltip>
    );
};

export default Amount;
