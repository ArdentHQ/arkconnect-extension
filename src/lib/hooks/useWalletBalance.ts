import { useEffect, useState } from 'react';
import { useExchangeRates } from '@/lib/hooks/useExchangeRates';
import { Contracts } from '@ardenthq/sdk-profiles';

export const useWalletBalance = (primaryWallet: Contracts.IReadWriteWallet | undefined) => {
  const { isLoading, rates } = useExchangeRates();
  const [convertedBalance, setConvertedBalance] = useState<number>(0);

  const balance = primaryWallet?.balance() ?? 0;
  const currency = primaryWallet?.exchangeCurrency();
  const isTest = primaryWallet?.network().isTest();

  useEffect(() => {
    if (!currency || isLoading || !rates || isTest) {
      return;
    }

    const currencySymbol = currency.toLowerCase();

    if (currencySymbol in rates) {
      setConvertedBalance(rates[currencySymbol] * balance);
    }
  }, [isLoading, currency, balance, isTest]);

  return isTest ? undefined : convertedBalance;
};
