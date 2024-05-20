import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { FormikProps } from 'formik';
import { FeeTypeSwtich } from './FeeTypeSwtich';
import { FeeOptionsList } from './FeeOptionsList';
import { useNetworkFees } from '@/lib/hooks/useNetworkFees';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { NumericInput } from '@/shared/components/input/NumericInput';
import { useProfileContext } from '@/lib/context/Profile';

export const FeeSection = ({ formik }: { formik: FormikProps<{ fee: string }> }) => {
    const { t } = useTranslation();
    const { profile } = useProfileContext();
    const [advancedFeeView, setAdvancedFeeView] = useState<boolean>(false);

    const activeNetwork = useActiveNetwork();
    const { isLoadingFee, fees } = useNetworkFees({
        profile,
        coin: activeNetwork.coin(),
        network: activeNetwork.id(),
        type: 'transfer',
    });

    const handleFeeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.value = event.target.value.trim();
        formik.handleChange(event);
    };

    const handleFeeViewClick = () => {
        if (advancedFeeView && fees) {
            onFeeChange(fees.avg);
        }
        setAdvancedFeeView(!advancedFeeView);
    };

    const onFeeChange = (value: string) => {
        formik.setFieldValue('fee', value);
    };

    useEffect(() => {
        if (fees && !formik.values.fee && !advancedFeeView) {
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
                    onChange={handleFeeChange}
                    onValueChange={onFeeChange}
                    value={formik.values.fee}
                    variant={formik.errors.fee && formik.values.fee ? 'destructive' : 'primary'}
                    helperText={formik.errors.fee && formik.values.fee && formik.errors.fee}
                    onBlur={formik.handleBlur}
                />
            ) : (
                <FeeOptionsList
                    fees={fees}
                    isLoading={isLoadingFee}
                    setFee={onFeeChange}
                    fee={formik.values.fee}
                />
            )}
        </div>
    );
};
