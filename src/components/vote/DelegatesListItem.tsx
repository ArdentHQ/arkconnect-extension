import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Contracts } from '@ardenthq/sdk-profiles';

export const DelegatesListItem = ({ delegate }: { delegate: Contracts.IReadOnlyWallet }) => {
    const { t } = useTranslation();

    return (
        <div
            className={classNames(
                'flex w-full items-center justify-between rounded-lg border px-4 py-3',
            )}
        >
            <div className='text-md w-8 font-normal leading-[125%] text-black dark:text-white'>
                {delegate.isResignedDelegate() ? (
                    <span className='text-theme-gray-400 text-sm font-medium'>-</span>
                ) : (
                    delegate.rank()
                )}
            </div>

            <div className='flex w-2/4 items-center overflow-auto'>
                <div className='text-md flex-1 overflow-hidden font-normal leading-[125%] text-black dark:text-white'>
                    {delegate.username()}
                </div>

                {delegate.isResignedDelegate() && (
                    <div className='ml-auto flex-shrink-0 text-xs'>{t('RESIGNED')}</div>
                )}
            </div>

            <div className='text-center'></div>

            <div className='w-20 text-right'>
                <a
                    href='#'
                    target='_blank'
                    className={classNames('font-bold', {
                        'text-theme-error-600 hover:text-theme-error-700 dark:text-theme-error-500':
                            true,
                    })}
                >
                    Select
                </a>
            </div>
        </div>
    );
};
