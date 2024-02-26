import constants from '@/constants';
import { Helpers } from '@ardenthq/sdk-profiles';

const extractPrefix = (str: string): string => {
  // Regular expression to match everything before the first digit
  const match = str.match(/^[^\d]*/);
  return match ? match[0] : '';
};

const extractSuffix = (str: string): string => {
  // Regular expression to match everything after the last digit
  const match = str.match(/(?:\d)([^0-9]*)$/);
  return match ? match[1] : '';
};

const cropToMaxDigits = ({
  value,
  ticker = '',
  maxDigits = constants.MAX_CURRENCY_DIGITS_ALLOWED,
  withTicker = true,
}: {
  value: number;
  ticker?: string;
  maxDigits?: number;
  withTicker?: boolean;
}) => {
  // If no ticker is provided "default" withTicker to false
  const addTicker = withTicker && !!ticker;

  const decimalSeparator = Helpers.Currency.format(1.1, ticker, { withTicker: false }).split('')[1];

  const formattedValueWithoutTicker = Helpers.Currency.format(value, ticker, { withTicker: false });

  const formattedValue = Helpers.Currency.format(value, ticker, { withTicker: addTicker });

  let integersPart = formattedValueWithoutTicker.split(decimalSeparator)[0];

  let decimalsPart = formattedValueWithoutTicker.split(decimalSeparator)[1];

  let tickerPrefix = '';
  let tickerSuffix = '';

  // Extract the ticker wheter is a prefix or a suffix to add it later to the
  // cropped value
  if (withTicker) {
    const integersPartWithSuffix = formattedValue.split(decimalSeparator)[0];
    tickerPrefix = extractPrefix(integersPartWithSuffix);

    const decimalsPartWithPrefix = formattedValue.split(decimalSeparator)[1];
    tickerSuffix = extractSuffix(decimalsPartWithPrefix ?? integersPartWithSuffix);
  }

  // 1. Add prefix (can be empty)
  const parts = [tickerPrefix];

  // 2. If the integer part does not fix in the maxDigits, we need to abbreviate
  const integerDigits = integersPart.length;

  if (integerDigits > maxDigits) {
    const formatCash = Intl.NumberFormat([navigator.language, 'en-US'], {
      notation: 'compact',
      maximumFractionDigits: 1,
      // @ts-ignore see https://github.com/microsoft/TypeScript/issues/52072
      roundingMode: 'floor',
    }).format(value);

    integersPart = formatCash;
    decimalsPart = '';
  } else if (decimalsPart) {
    const totalSpotsForDecimals = maxDigits - integersPart.length;
    decimalsPart = decimalsPart.slice(0, totalSpotsForDecimals).trim();
  }

  parts.push(integersPart);

  if (decimalsPart) {
    parts.push(decimalSeparator);
    parts.push(decimalsPart);
  }

  parts.push(tickerSuffix);

  return parts.join('');
};

export default cropToMaxDigits;
