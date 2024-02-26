import { useMemo } from 'react';
import LocaleCurrency from 'locale-currency';
import { useCurrencyOptions } from './useCurrencyOptions';

const useLocaleCurrency = () => {
  const currencyOptions = useCurrencyOptions('cryptocompare');

  const localeCurrency = useMemo(() => {
    let locale = Intl.DateTimeFormat().resolvedOptions().locale;

    if (!locale.includes('-')) {
      locale = navigator.language;
    }

    let currency = LocaleCurrency.getCurrency(locale) as string | null;

    if (!currency) {
      currency = 'USD';
    }

    return currency;
  }, []);

  const defaultCurrency = useMemo(() => {
    const [fiatOptions] = currencyOptions;

    if (
      fiatOptions.options.some(
        (option) => `${option.value}`.toLowerCase() === localeCurrency.toLowerCase(),
      )
    ) {
      return localeCurrency;
    }

    return 'USD';
  }, [currencyOptions, localeCurrency]);

  return { defaultCurrency, localeCurrency };
};

export default useLocaleCurrency;
