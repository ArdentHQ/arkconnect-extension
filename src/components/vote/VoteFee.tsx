import { FocusEventHandler, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FeeSection } from '../fees';
import { useProfileContext } from '@/lib/context/Profile';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { useNetworkFees } from '@/lib/hooks/useNetworkFees';
import useOnClickOutside from '@/lib/hooks/useOnClickOutside';
export const VoteFee = ({
    delegateAddress,
    fee,
    feeError,
    onSelectedFee,
    onBlur,
}: {
    delegateAddress?: string;
    fee: string;
    feeError?: string;
    onSelectedFee: (fee: string) => void;
    onBlur: FocusEventHandler<HTMLInputElement>;
}) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const activeNetwork = useActiveNetwork();

    const { profile } = useProfileContext();

    const { isLoadingFee, fees } = useNetworkFees({
        profile,
        coin: activeNetwork.coin(),
        network: activeNetwork.id(),
        type: 'vote',
    });

    useEffect(() => {
        if (fees?.avg) {
            onSelectedFee(fees.avg);
        }
    }, [fees]);

    const disabled = delegateAddress === undefined || isLoadingFee;

    const feeFormRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(feeFormRef, () => setIsEditing(false));

    if (isEditing) {
        return (
            <div ref={feeFormRef}>
                <FeeSection
                    onBlur={onBlur}
                    variant={fee && feeError ? 'destructive' : 'primary'}
                    helperText={fee ? feeError : undefined}
                    value={fee}
                    setValue={onSelectedFee}
                    feeType='vote'
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
