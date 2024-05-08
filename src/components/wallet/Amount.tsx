import cn from 'classnames';
import { Helpers } from '@ardenthq/sdk-profiles';
import { TippyProps } from '@tippyjs/react';
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
    hideSmallValues?: boolean;
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
    hideSmallValues = false,
}: AmountProperties) => {
    let actualFormattedAmount = Helpers.Currency.format(value, ticker, { withTicker });
    const valueToFormat = hideSmallValues && value !== 0 && value < 0.01 ? 0.01 : value;

    let formattedAmount = cropToMaxDigits({
        value: valueToFormat,
        ticker,
        maxDigits,
        withTicker,
        maxDecimals,
    });

    if (valueToFormat !== value) {
        formattedAmount = ` <${formattedAmount}`; // Note: has a space before it to avoid "+<0.01"
    }

    if (value === 0 && !['ARK', 'DARK'].includes(formattedAmount.split(' ')[1])) {
        const currencySymbol = formattedAmount.match(/[^\d.,]+/);
        formattedAmount = `${currencySymbol}0.00`;
    } else if (showSign) {
        if (value !== 0) {
            formattedAmount = `${isNegative ? '-' : '+'}${formattedAmount}`;
            actualFormattedAmount = `${isNegative ? '-' : '+'}${actualFormattedAmount}`;
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
