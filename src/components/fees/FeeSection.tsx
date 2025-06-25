import { useTranslation } from 'react-i18next';
import { ChangeEvent, ComponentPropsWithRef, useEffect, useState } from 'react';
import { FormikErrors } from 'formik';
import { FeeTypeSwtich } from './FeeTypeSwtich';
import { FeeOptionsList } from './FeeOptionsList';
import { useNetworkFees } from '@/lib/hooks/useNetworkFees';
import { NumericInput } from '@/shared/components/input/NumericInput';
import { useProfileContext } from '@/lib/context/Profile';
import constants from '@/constants';
import { SendFormik } from '@/pages/Send';
import { VoteFormik } from '@/pages/Vote';
import { BigNumber } from '@/lib/helpers';

type AddressDropdownProps = ComponentPropsWithRef<'input'> & {
    variant?: 'primary' | 'destructive';
    helperText?: string;
    feeType?: string;
    errors: FormikErrors<SendFormik>;
    values: SendFormik | VoteFormik;
    handleFeeClassChange?: (feeClass: string) => void;
    onGasPriceChange: (price: string) => void;
    onGasLimitChange: (limit: string) => void;
};

export const FeeLimits = {
    gasPrice: [5, 10_000],
    gasLimit: [21_000, 5_000_000],
};

export const FeeSection = ({
    errors,
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
                <div className='space-y-4'>
                    <NumericInput
                        id='gasPrice'
                        placeholder='0.00'
                        labelText={t('COMMON.GAS_PRICE_GWEI')}
                        onValueChange={(value) => {
                            onGasPriceChange(value);
                        }}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            const valueRaw = event.target.value.trim();
                            const value = BigNumber.make(valueRaw && valueRaw !== '' ? valueRaw : '0');
                            onGasPriceChange(value.toString());
                        }}
                        value={gasPrice}
                        min={FeeLimits.gasPrice[0]}
                        max={FeeLimits.gasPrice[1]}
                        variant={gasPrice && errors.gasPrice ? 'destructive' : 'primary'}
                        helperText={gasPrice && errors.gasPrice ? errors.gasPrice : undefined}
                        autoComplete='off'
                        step={1}
                    />

                    <NumericInput
                        id='gasLimit'
                        placeholder='0.00'
                        labelText={t('COMMON.GAS_LIMIT')}
                        onValueChange={(value) => {
                            onGasLimitChange(value);
                        }}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            const valueRaw = event.target.value.trim();
                            const value = BigNumber.make(valueRaw && valueRaw !== '' ? valueRaw : '0');
                            onGasPriceChange(value.toString());
                        }}
                        value={gasLimit}
                        min={FeeLimits.gasLimit[0]}
                        max={FeeLimits.gasLimit[1]}
                        variant={gasLimit && errors.gasLimit ? 'destructive' : 'primary'}
                        helperText={gasLimit && errors.gasLimit ? errors.gasLimit : undefined}
                        autoComplete='off'
                        step={1000}
                    />
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
