import { useTranslation } from 'react-i18next';
import { ChangeEvent, ComponentPropsWithRef, useEffect, useState } from 'react';
import { FeeTypeSwtich } from './FeeTypeSwtich';
import { FeeOptionsList } from './FeeOptionsList';
import { useNetworkFees } from '@/lib/hooks/useNetworkFees';
import { NumericInput } from '@/shared/components/input/NumericInput';
import { useProfileContext } from '@/lib/context/Profile';
import constants from '@/constants';
import { SendFormik } from '@/pages/Send';

type AddressDropdownProps = ComponentPropsWithRef<'input'> & {
    variant?: 'primary' | 'destructive';
    helperText?: string;
    feeType?: string;
    values: SendFormik;
    handleFeeClassChange?: (feeClass: string) => void;
    onGasPriceChange: (price: string) => void;
    onGasLimitChange: (limit: string) => void;
};

export const FeeLimits = {
    gasPrice: [5, 10_000],
    gasLimit: [21_000, 5_000_000],
};

export const FeeSection = ({
    variant,
    helperText,
    values,
    feeType = 'transfer',
    onGasPriceChange,
    onGasLimitChange,
    handleFeeClassChange,
}: AddressDropdownProps) => {
    const { t } = useTranslation();

    const { gasLimit, gasPrice } = values;
    const feeClass = values.feeClass ?? constants.FEE_AVERAGE;

    const [advancedFeeView, setAdvancedFeeView] = useState<boolean>(
        feeClass === constants.FEE_CUSTOM,
    );
    const { profile } = useProfileContext();

    const { isLoadingFee, fees, estimatedGasLimit } = useNetworkFees({
        profile,
        network: profile.activeNetwork().id(),
        type: feeType,
    });

    const handleFeeViewClick = () => {
        setAdvancedFeeView(!advancedFeeView);
        handleFeeClassChange?.(!advancedFeeView ? constants.FEE_CUSTOM : constants.FEE_AVERAGE);
    };

    const onFeeChange = (type: string, value: string) => {
        handleFeeClassChange?.(type);
        onGasPriceChange(value);
        onGasLimitChange(estimatedGasLimit.toString());
    };

    useEffect(() => {
        if (fees && !advancedFeeView) {
            onFeeChange(constants.FEE_AVERAGE, fees.avg);
        }
    }, [fees, advancedFeeView]);

    useEffect(() => {
        if (feeClass !== constants.FEE_CUSTOM && fees) {
            switch (feeClass) {
                case constants.FEE_SLOW:
                    onFeeChange(constants.FEE_SLOW, fees.min);
                    break;
                case constants.FEE_AVERAGE:
                    onFeeChange(constants.FEE_AVERAGE, fees.avg);
                    break;
                case constants.FEE_FAST:
                    onFeeChange(constants.FEE_FAST, fees.max);
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
                <div className='border-theme-gray-400 dark:border-theme-gray-500 -mx-4 overflow-hidden rounded-xl border'>
                    <div className='space-y-4 p-4'>
                        <NumericInput
                            id='gasPrice'
                            placeholder='0.00'
                            labelText='Gas Price (in Gwei)'
                            onValueChange={(value) => {
                                onGasPriceChange(value);
                            }}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                const value = event.target.value.trim();
                                onGasPriceChange(value && value !== '' ? value : '0');
                            }}
                            helperText={helperText}
                            value={gasPrice}
                            min={FeeLimits.gasPrice[0]}
                            max={FeeLimits.gasPrice[1]}
                            variant={variant}
                            autoComplete='off'
                            step={1}
                        />

                        <NumericInput
                            id='gasLimit'
                            placeholder='0.00'
                            labelText={'Gas Limit'}
                            onValueChange={(value) => {
                                onGasLimitChange(value);
                            }}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                const value = event.target.value.trim();
                                onGasLimitChange(value && value !== '' ? value : '0');
                            }}
                            helperText={helperText}
                            value={gasLimit}
                            min={FeeLimits.gasLimit[0]}
                            max={FeeLimits.gasLimit[1]}
                            variant={variant}
                            autoComplete='off'
                            step={1000}
                        />
                    </div>
                </div>
            ) : (
                <FeeOptionsList
                    fees={fees}
                    gasLimit={gasLimit}
                    isLoading={isLoadingFee}
                    onOptionChange={(feeClass: string, value: string) => {
                        onFeeChange(feeClass, value);
                    }}
                    selectedClass={feeClass}
                />
            )}
        </div>
    );
};
