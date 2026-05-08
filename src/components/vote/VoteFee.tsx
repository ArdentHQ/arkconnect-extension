import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps } from 'formik';
import { FeeSection } from '../fees';
import { useProfileContext } from '@/lib/context/Profile';
import { calculateGasFee, useNetworkFees } from '@/lib/hooks/useNetworkFees';
import useOnClickOutside from '@/lib/hooks/useOnClickOutside';
import { VoteFormik } from '@/pages/Vote';
import constants from '@/constants';

export const VoteFee = ({ formik }: { formik: FormikProps<VoteFormik> }) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { profile } = useProfileContext();

    const activeNetwork = profile.activeNetwork();

    const { fees, isLoadingFee, estimatedGasLimit } = useNetworkFees({
        profile,
        network: activeNetwork.id(),
        type: 'vote',
    });

    const { validatorAddress, gasLimit, gasPrice } = formik.values;

    useEffect(() => {
        if (fees?.avg && gasPrice === '') {
            void formik.setFieldValue('gasPrice', fees.avg);
            void formik.setFieldValue('feeClass', constants.FEE_AVERAGE);
        }

        if (estimatedGasLimit.isGreaterThan(0) && gasLimit === '') {
            void formik.setFieldValue('gasLimit', estimatedGasLimit.toString());
        }
    }, [fees, gasLimit, gasLimit, estimatedGasLimit]);

    const fee = calculateGasFee(gasPrice, gasLimit);

    const disabled = validatorAddress === undefined || isLoadingFee;

    const feeFormRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(feeFormRef, () => setIsEditing(false));

    const handleGasPriceChange = (price: string) => {
        formik.setFieldValue('gasPrice', price);
    };

    const handleGasLimitChange = (limit: string) => {
        formik.setFieldValue('gasLimit', limit);
    };

    if (isEditing) {
        return (
            <div ref={feeFormRef}>
                <FeeSection
                    errors={formik.errors}
                    values={formik.values}
                    feeType='vote'
                    onGasPriceChange={handleGasPriceChange}
                    onGasLimitChange={handleGasLimitChange}
                    handleFeeClassChange={(value: string) =>
                        formik.setFieldValue('feeClass', value)
                    }
                />
            </div>
        );
    }

    return (
        <div className='border-theme-secondary-400 text-theme-secondary-500 dark:border-theme-secondary-500 flex h-[42px] items-center justify-between space-x-2 rounded-lg border px-3 text-sm'>
            <span className='dark:text-theme-secondary-200 truncate text-sm font-medium'>
                {t('COMMON.TRANSACTION_FEE')}
            </span>

            <div className='dark:text-theme-secondary-500 flex items-center space-x-1.5'>
                {disabled ? (
                    <span>- {activeNetwork.ticker()}</span>
                ) : (
                    <span className='dark:text-theme-secondary-200 font-medium whitespace-nowrap text-black'>
                        {fee} {activeNetwork.ticker()}
                    </span>
                )}

                <span className='bg-theme-secondary-400 h-1 w-1 rounded-full'></span>

                {disabled ? (
                    <span className='font-medium'>{t('PAGES.VOTE.EDIT_FEE')}</span>
                ) : (
                    <button
                        type='button'
                        className='transition-smoothEase text-theme-primary-700 hover:text-theme-primary-600 dark:text-theme-primary-600 dark:hover:text-theme-primary-650 font-medium whitespace-nowrap'
                        onClick={() => setIsEditing(true)}
                    >
                        {t('PAGES.VOTE.EDIT_FEE')}
                    </button>
                )}
            </div>
        </div>
    );
};
