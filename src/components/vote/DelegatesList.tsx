import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
import { DelegatesListItem } from './DelegatesListItem';
import { DelegatesListItemSkeleton } from './DelegatesListItemSkeleton';
import { WarningIcon } from '@/shared/components';

export const DelegatesList = ({
    delegates,
    isLoading,
}: {
    delegates: Contracts.IReadOnlyWallet[];
    isLoading: boolean;
}) => {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className='w-full overflow-hidden rounded-xl bg-white py-2 dark:bg-subtle-black'>
                <table className='w-full'>
                    <tbody>
                        {Array.from({ length: 10 }).map((_, index) => {
                            return <DelegatesListItemSkeleton key={index} />;
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    if (delegates.length === 0) {
        return (
            <div className='flex flex-1 items-center'>
                <div className='mx-auto flex max-w-64 flex-col items-center space-y-4 text-center'>
                    <span>
                        <WarningIcon iconClassName='w-[130px] h-auto' />
                    </span>
                    <span className='dark:text-white'>{t('PAGES.VOTE.NO_RESULTS')}</span>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full overflow-hidden rounded-xl bg-white py-2 dark:bg-subtle-black'>
            <table className='w-full'>
                <tbody>
                    {delegates.map((delegate) => {
                        return <DelegatesListItem key={delegate.address()} delegate={delegate} />;
                    })}
                </tbody>
            </table>
        </div>
    );
};
