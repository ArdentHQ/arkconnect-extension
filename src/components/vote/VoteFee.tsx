import { useEffect } from 'react';
import { useProfileContext } from '@/lib/context/Profile';
import useActiveNetwork from '@/lib/hooks/useActiveNetwork';
import { useNetworkFees } from '@/lib/hooks/useNetworkFees';

export const VoteFee = ({
    delegateAddress,
    fee,
    onSelectedFee,
}: {
    delegateAddress: string;
    fee: string;
    onSelectedFee: (fee: string) => void;
}) => {
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

    const disabled = delegateAddress === '' || isLoadingFee;

    return (
        <div className='flex h-[42px] items-center justify-between space-x-2 overflow-auto rounded-lg border border-theme-secondary-400 p-3 text-sm text-theme-secondary-500 dark:border-theme-secondary-500'>
            <span className='truncate text-sm font-medium dark:text-theme-secondary-200'>
                Transaction Fee
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
                    <span className='font-medium'>Edit Fee</span>
                ) : (
                    <button
                        type='button'
                        className='transition-smoothEase whitespace-nowrap font-medium text-theme-primary-700 hover:text-theme-primary-600 dark:text-theme-primary-600 dark:hover:text-theme-primary-650'
                    >
                        Edit Fee
                    </button>
                )}
            </div>
        </div>
    );
};
