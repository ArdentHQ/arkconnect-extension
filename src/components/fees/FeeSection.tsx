import { useTranslation } from 'react-i18next';
import { ComponentPropsWithRef, useEffect, useState } from 'react';
import { FeeTypeSwtich } from './FeeTypeSwtich';
import { FeeOptionsList } from './FeeOptionsList';
import { useNetworkFees } from '@/lib/hooks/useNetworkFees';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { NumericInput } from '@/shared/components/input/NumericInput';
import { useProfileContext } from '@/lib/context/Profile';

type AddressDropdownProps = ComponentPropsWithRef<'input'> & {
    variant?: 'primary' | 'destructive';
    helperText?: string;
    value: string;
    setValue: (value: string) => void;
    feeType?: string;
    step?: number;
};

export const FeeSection = ({
    variant,
    helperText,
    value,
    setValue,
    step = 0.01,
    feeType = 'transfer',
    ...rest
}: AddressDropdownProps) => {
    const { t } = useTranslation();
    const [advancedFeeView, setAdvancedFeeView] = useState<boolean>(false);
    const activeNetwork = useActiveNetwork();
    const { profile } = useProfileContext();

    const { isLoadingFee, fees } = useNetworkFees({
        profile,
        coin: activeNetwork.coin(),
        network: activeNetwork.id(),
        type: feeType,
    });

    const handleFeeViewClick = () => {
        if (advancedFeeView && fees) {
            onFeeChange(fees.avg);
        }
        setAdvancedFeeView(!advancedFeeView);
    };

    const onFeeChange = (value: string) => {
        setValue(value);
    };

    useEffect(() => {
        if (fees && !value && !advancedFeeView) {
            onFeeChange(fees.avg);
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
                    isLoading={isLoadingFee}
                    setFee={onFeeChange}
                    fee={value}
                />
            )}
        </div>
    );
};
