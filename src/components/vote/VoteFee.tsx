import { Input } from '@/shared/components';

export const VoteFee = ({ delegateAddress }: { delegateAddress: string }) => {
    if (delegateAddress === '') {
        return (
            <div className='flex h-[42px] items-center justify-between rounded-lg border border-theme-secondary-400 p-3 text-sm  text-theme-secondary-500 dark:border-theme-secondary-500'>
                <span className='text-sm font-medium dark:text-theme-secondary-200'>
                    Transaction Fee
                </span>

                <div className='flex items-center space-x-1.5 dark:text-theme-secondary-500'>
                    <span>- ARK</span>

                    <span className='h-1 w-1 rounded-full bg-theme-secondary-400'></span>

                    <span className='font-medium'>Edit Fee</span>
                </div>
            </div>
        );
    }

    return <Input />;
};
