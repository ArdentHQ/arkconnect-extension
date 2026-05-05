import cn from 'classnames';
import { TippyProps } from '@tippyjs/react';
import constants from '@/constants';
import cropToMaxDigits from '@/lib/utils/cropToMaxDigits';
import { Tooltip } from '@/shared/components';
import { Currency } from '@/lib/profiles/helpers';
import { NumberLike } from '@/lib/helpers';

interface AmountProperties {
    ticker: string;
    value: NumberLike;
    showSign?: boolean;
    withTicker?: boolean;
    isNegative?: boolean;
    maxDigits?: number;
    tooltipPlacement?: TippyProps['placement'];
    underlineOnHover?: boolean;
    maxDecimals?: number;
    displayTooltip?: boolean;
    hideSmallValues?: boolean;
    className?: string;
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
    className,
}: AmountProperties) => {
    const numericValue =
        typeof value === 'number' ? value : Number((value as { toNumber?: () => number }).toNumber?.() ?? value ?? 0);
    let actualFormattedAmount = Currency.format(numericValue, ticker, { withTicker });
    const valueToFormat =
        hideSmallValues && numericValue !== 0 && numericValue < 0.01 ? 0.01 : numericValue;

    let formattedAmount = cropToMaxDigits({
        value: valueToFormat,
        ticker,
        maxDigits,
        withTicker,
        maxDecimals,
    });

    if (valueToFormat !== numericValue) {
        formattedAmount = ` <${formattedAmount}`; // Note: has a space before it to avoid "+<0.01"
    }

    if (numericValue === 0 && !['ARK', 'DARK'].includes(formattedAmount.split(' ')[1])) {
        const currencySymbol = formattedAmount.match(/[^\d.,]+/);
        formattedAmount = `${currencySymbol}0.00`;
    } else if (showSign) {
        if (numericValue !== 0) {
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
                }, className)}
            >
                {formattedAmount}
            </span>
        </Tooltip>
    );
};

export default Amount;
