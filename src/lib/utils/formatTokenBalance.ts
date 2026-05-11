import { BigNumber } from '@/lib/helpers';
import { Numeral } from '@/lib/intl/numeral';

const COMPACT_THRESHOLD_DIGITS = 7;

/**
 * Formats a token balance for display:
 * - Compacts values with more than 7 integer digits using a suffix (K, M, B, T, ...).
 * - Otherwise renders the value with locale-aware thousand separators.
 */
export const formatTokenBalance = (balance: BigNumber, locale = 'en-US'): string => {
    const integerDigits = balance.integerValue().toString().length;
    const numeral = Numeral.make(locale, { maximumFractionDigits: 2 });

    if (integerDigits > COMPACT_THRESHOLD_DIGITS) {
        const { value, suffix } = numeral.formatCompact(balance);
        return `${numeral.format(value)}${suffix ?? ''}`;
    }

    return new Intl.NumberFormat(locale, {
        maximumFractionDigits: 8,
    }).format(balance.toNumber());
};
