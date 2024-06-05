export const VoteFee = ({ delegateAddress }: { delegateAddress: string }) => {
    const disabled = delegateAddress === '';
    return (
        <div className='flex h-[42px] items-center justify-between rounded-lg border border-theme-secondary-400 p-3 text-sm text-theme-secondary-500 dark:border-theme-secondary-500'>
            <span className='text-sm font-medium dark:text-theme-secondary-200'>
                Transaction Fee
            </span>

            <div className='flex items-center space-x-1.5 dark:text-theme-secondary-500'>
                {disabled ? (
                    <span>- ARK</span>
                ) : (
                    // @TODO: remove hardcoded value
                    <span className='font-medium text-black'>0.60 ARK</span>
                )}

                <span className='h-1 w-1 rounded-full bg-theme-secondary-400'></span>

                {disabled ? (
                    <span className='font-medium'>Edit Fee</span>
                ) : (
                    <button
                        type='button'
                        className='transition-smoothEase font-medium text-theme-primary-700 hover:text-theme-primary-600 dark:text-theme-primary-600 dark:hover:text-theme-primary-650'
                    >
                        Edit Fee
                    </button>
                )}
            </div>
        </div>
    );
};
