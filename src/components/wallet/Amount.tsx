import constants from '@/constants';
import cropToMaxDigits from '@/lib/utils/cropToMaxDigits';
import { Tooltip } from '@/shared/components';
import { Helpers } from '@ardenthq/sdk-profiles';

interface AmountProperties {
  ticker: string;
  value: number;
  showSign?: boolean;
  withTicker?: boolean;
  isNegative?: boolean;
  maxDigits?: number;
}

const Amount = ({
  value,
  ticker,
  withTicker = true,
  isNegative,
  showSign,
  maxDigits = constants.MAX_CURRENCY_DIGITS_ALLOWED,
}: AmountProperties) => {
  const actualFormattedAmount = Helpers.Currency.format(value, ticker, { withTicker });

  let formattedAmount = cropToMaxDigits({
    value,
    ticker,
    maxDigits,
    withTicker,
  });

  if (value === 0 && !['ARK', 'DARK'].includes(formattedAmount.split(' ')[1])) {
    const currencySymbol = formattedAmount.match(/[^\d.,]+/);
    formattedAmount = `${currencySymbol}0.00`;
  } else if (showSign) {
    formattedAmount = `${isNegative ? '-' : '+'} ${formattedAmount}`;
  }

  return (
    <Tooltip
      disabled={formattedAmount === actualFormattedAmount}
      content={actualFormattedAmount}
      placement='top'
    >
      <span>{formattedAmount}</span>
    </Tooltip>
  );
};

export default Amount;
