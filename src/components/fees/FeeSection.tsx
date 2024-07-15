import { useTranslation } from 'react-i18next';
import { ComponentPropsWithRef, useEffect, useState } from 'react';
import { FeeTypeSwtich } from './FeeTypeSwtich';
import { FeeOptionsList } from './FeeOptionsList';
import { useNetworkFees } from '@/lib/hooks/useNetworkFees';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { NumericInput } from '@/shared/components/input/NumericInput';
import { useProfileContext } from '@/lib/context/Profile';
import constants from '@/constants';

type AddressDropdownProps = ComponentPropsWithRef<'input'> & {
    variant?: 'primary' | 'destructive';
    helperText?: string;
    value: string;
    setValue: (value: string) => void;
    feeType?: string;
    step?: number;
    feeClass?: string;
    handleFeeClassChange?: (feeClass: string) => void;
};

export const FeeSection = ({
    variant,
    helperText,
    value,
    setValue,
    step = 0.01,
    feeType = 'transfer',
    feeClass = constants.FEE_DEFAULT,
    handleFeeClassChange,
    ...rest
}: AddressDropdownProps) => {
    const { t } = useTranslation();
    const [advancedFeeView, setAdvancedFeeView] = useState<boolean>(feeClass === constants.FEE_CUSTOM);
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
        handleFeeClassChange?.(!advancedFeeView ? constants.FEE_CUSTOM : constants.FEE_DEFAULT);
    };

    const onFeeChange = (value: string) => {
        setValue(value);
    };

    useEffect(() => {
        if (fees && !value && !advancedFeeView) {
            onFeeChange(fees.avg);
        }
    }, [fees, advancedFeeView]);

    useEffect(() => {
        if (feeClass !== constants.FEE_CUSTOM && fees) {
            switch (feeClass) {
                case constants.FEE_SLOW:
                    onFeeChange(fees.min);
                    break;
                case constants.FEE_DEFAULT:
                    onFeeChange(fees.avg);
                    break;
                case constants.FEE_FAST:
                    onFeeChange(fees.max);
                    break;
            }
        }
    }, []);

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
                    setFeeClass={(feeClass: string) => handleFeeClassChange?.(feeClass)}
                />
            )}
        </div>
    );
};
