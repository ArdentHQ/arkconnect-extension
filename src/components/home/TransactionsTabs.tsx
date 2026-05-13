import classNames from 'classnames';

export function TransactionTab({
    children,
    active,
    onClick,
}: {
    children: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={classNames(
                [
                    'transition-smoothEase flex h-6 flex-1 select-none items-center justify-center rounded-lg',
                ],
                {
                    'bg-white text-light-black dark:bg-subtle-black dark:text-white': active,
                    'cursor-pointer text-theme-secondary-500 hover:bg-theme-secondary-300 hover:text-light-black dark:bg-theme-secondary-800 dark:text-theme-secondary-300 dark:hover:bg-theme-secondary-700 dark:hover:text-white':
                        !active,
                },
            )}
        >
            {children}
        </div>
    );
}

export function TransactionsTabs({ children }: { children: React.ReactNode }) {
    return (
        <div className='pt-4'>
            <div className='rounded-xl bg-white pt-4 dark:bg-subtle-black'>
                <div className='mx-4 flex space-x-1 rounded-xl bg-theme-secondary-200 p-1 text-sm font-medium dark:bg-theme-secondary-800'>
                    {children}
                </div>

                <div className='mt-4 flex items-center justify-between border-t border-theme-secondary-200 bg-theme-secondary-50 px-4 py-1 text-theme-secondary-500 dark:border-theme-secondary-600 dark:bg-theme-secondary-800 dark:text-theme-secondary-300'>
                    <span>Name</span>
                    <span>Token Balance</span>
                </div>
            </div>
        </div>
    );
}
