import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps } from 'formik';
import { FeeSection } from '../fees';
import { useProfileContext } from '@/lib/context/Profile';
import { calculateGasFee, useNetworkFees } from '@/lib/hooks/useNetworkFees';
import useOnClickOutside from '@/lib/hooks/useOnClickOutside';
import { VoteFormik } from '@/pages/Vote';

export const VoteFee = ({ formik }: { formik: FormikProps<VoteFormik> }) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { profile } = useProfileContext();

    const activeNetwork = profile.activeNetwork();

    const { isLoadingFee } = useNetworkFees({
        profile,
        network: activeNetwork.id(),
        type: 'vote',
    });

    const { delegateAddress, gasLimit, gasPrice } = formik.values;

    const fee = calculateGasFee(gasPrice, gasLimit);

    const disabled = delegateAddress === undefined || isLoadingFee;

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
                    // variant={fee && feeError ? 'destructive' : 'primary'}
                    // helperText={fee ? feeError : undefined}
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
        <div className='flex h-[42px] items-center justify-between space-x-2 rounded-lg border border-theme-secondary-400 px-3 text-sm text-theme-secondary-500 dark:border-theme-secondary-500'>
            <span className='truncate text-sm font-medium dark:text-theme-secondary-200'>
                {t('COMMON.TRANSACTION_FEE')}
            </span>

            <div className='flex items-center space-x-1.5 dark:text-theme-secondary-500'>
                {disabled ? (
                    <span>- {activeNetwork.coin()}</span>
                ) : (
                    <span className='whitespace-nowrap font-medium text-black dark:text-theme-secondary-200'>
                        {fee} {activeNetwork.coin()}
                    </span>
                )}

                <span className='h-1 w-1 rounded-full bg-theme-secondary-400'></span>

                {disabled ? (
                    <span className='font-medium'>{t('PAGES.VOTE.EDIT_FEE')}</span>
                ) : (
                    <button
                        type='button'
                        className='transition-smoothEase whitespace-nowrap font-medium text-theme-primary-700 hover:text-theme-primary-600 dark:text-theme-primary-600 dark:hover:text-theme-primary-650'
                        onClick={() => setIsEditing(true)}
                    >
                        {t('PAGES.VOTE.EDIT_FEE')}
                    </button>
                )}
            </div>
        </div>
    );
};
