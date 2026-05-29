import classNames from 'classnames';

export enum Tabs {
    TOKENS = 'TOKENS',
    TRANSACTIONS = 'TRANSACTIONS',
}

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
                    'transition-smoothEase flex h-6 flex-1 items-center justify-center rounded-lg select-none',
                ],
                {
                    'text-light-black dark:bg-subtle-black bg-white dark:text-white': active,
                    'text-theme-secondary-500 hover:bg-theme-secondary-300 hover:text-light-black dark:bg-theme-secondary-800 dark:text-theme-secondary-300 dark:hover:bg-theme-secondary-700 cursor-pointer dark:hover:text-white':
                        !active,
                },
            )}
        >
            {children}
        </div>
    );
}

export function TransactionsTabs({ currentTab, children }: { currentTab: string; children: React.ReactNode }) {
    return (
        <div className='pt-4'>
            <div className='dark:bg-subtle-black rounded-t-xl bg-white pt-4'>
                <div className='bg-theme-secondary-200 dark:bg-theme-secondary-800 mx-4 flex space-x-1 rounded-xl p-1 text-sm font-medium'>
                    {children}
                </div>

                {currentTab === Tabs.TOKENS ? <div className='typeset-body border-theme-secondary-200 bg-theme-secondary-50 text-theme-secondary-500 dark:border-theme-secondary-600 dark:bg-theme-secondary-800 dark:text-theme-secondary-300 mt-4 flex items-center justify-between border-t px-4 py-1'>
                    <span>Name</span>
                    <span>Token Balance</span>
                </div> : <div className="border-theme-secondary-200 dark:border-theme-secondary-600 mt-4 border-t py-1"></div>}
            </div>
        </div>
    );
}
