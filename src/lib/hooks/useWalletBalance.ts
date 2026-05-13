import { useEffect, useState } from 'react';
import { Contracts } from '@/lib/profiles';
import { useExchangeRates } from '@/lib/hooks/useExchangeRates';
import { BigNumber } from "../helpers";

export const useWalletBalance = (primaryWallet: Contracts.IReadWriteWallet | undefined) => {
    const { isLoading, rates } = useExchangeRates();
    const [convertedBalance, setConvertedBalance] = useState<BigNumber>(BigNumber.ZERO);

    const balance = primaryWallet?.balance() ?? BigNumber.ZERO;
    const currency = primaryWallet?.exchangeCurrency();
    const isTest = primaryWallet?.network().isTest();

    useEffect(() => {
        if (!currency || isLoading || !rates || isTest) {
            return;
        }

        const currencySymbol = currency.toLowerCase();

        if (currencySymbol in rates) {
            setConvertedBalance(rates[currencySymbol].times(balance));
        }
    }, [isLoading, currency, balance, isTest]);

    return isTest ? undefined : convertedBalance;
};
