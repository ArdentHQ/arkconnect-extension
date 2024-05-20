import { useTranslation } from 'react-i18next';
import { ComponentPropsWithRef, useEffect, useState } from 'react';
import { FeeTypeSwtich } from './FeeTypeSwtich';
import { FeeOptionsList } from './FeeOptionsList';
import { useNetworkFees } from '@/lib/hooks/useNetworkFees';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { WalletNetwork } from '@/lib/store/wallet';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { NumericInput } from '@/shared/components/input/NumericInput';

type AddressDropdownProps = ComponentPropsWithRef<'input'> & {
    variant?: 'primary' | 'destructive';
    helperText?: string;
    value: string;
    setValue: (value: string) => void;
    step?: number;
}

export const FeeSection = ({ variant, helperText, value, setValue, step = 0.01, ...rest }: AddressDropdownProps) => {
    const { t } = useTranslation();
    const [advancedFeeView, setAdvancedFeeView] = useState<boolean>(false);
    const activeNetwork = useActiveNetwork();
    const primaryWallet = usePrimaryWallet();
    const { fees, isLoading } = useNetworkFees({
        network: activeNetwork.isTest() ? WalletNetwork.DEVNET : WalletNetwork.MAINNET,
        primaryWallet,
    });

    const handleFeeViewClick = () => {
        if (advancedFeeView && fees) {
            onFeeChange(fees.avg.crypto);
        }
        setAdvancedFeeView(!advancedFeeView);
    };

    const onFeeChange = (value: string) => {
        setValue(value);
    };

    useEffect(() => {
        if (fees && !value && !advancedFeeView) {
            onFeeChange(fees.avg.crypto);
        }
    }, [fees, advancedFeeView]);

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex w-full flex-row items-center justify-between'>
                <span className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-200'>
                    {t('COMMON.TRANSACTION_FEE')}
                </span>

                <FeeTypeSwtich
                    advancedFee={advancedFeeView}
                    setAdvancedFeeView={handleFeeViewClick}
                />
            </div>

            {advancedFeeView ? (
                <NumericInput
                    id='fee'
                    placeholder='0.00'
                    onValueChange={onFeeChange}
                    helperText={helperText}
                    value={value}
                    variant={variant}
                    autoComplete='off'
                    step={step}
                    {...rest}
                />
            ) : (
                <FeeOptionsList
                    fees={fees}
                    isLoading={isLoading}
                    setFee={onFeeChange}
                    fee={value}
                />
            )}
        </div>
    );
};
