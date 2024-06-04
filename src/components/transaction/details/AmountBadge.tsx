import cn from 'classnames';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Tooltip } from '@/shared/components';

export enum AmountBadgeType {
    DEFAULT = 'default',
    POSITIVE = 'positive',
    NEGATIVE = 'negative',
}

export const AmountBadge = ({
    amount,
    type = AmountBadgeType.DEFAULT,
    selfAmount,
}: {
    amount: ReactNode;
    type?: AmountBadgeType;
    selfAmount?: string;
}) => {
    const { t } = useTranslation();

    return (
        <div
            className={cn('flex items-center justify-center rounded font-bold text-sm border overflow-hidden', {
                'text-theme-secondary-500 bg-theme-secondary-100 border-theme-secondary-100 dark:text-theme-secondary-300 dark:border-theme-secondary-600 dark:bg-transparent':
                    type === 'default',
                'border-theme-green-100 bg-theme-green-100 text-theme-green-700 dark:border-theme-green-700 dark:text-theme-green-600 dark:bg-transparent':
                    type === 'positive',
                'border-theme-warning-75 bg-theme-warning-75 text-theme-warning-750 dark:bg-transparent dark:border-theme-error-350 dark:text-theme-error-300':
                    type === 'negative',
            })}
        >
            {selfAmount && (
                <Tooltip content={t('COMMON.EXCLUDING_AMOUNT_TO_SELF', { amount: selfAmount })}>
                    <div
                        className={cn('dark:text-white px-1.5 py-1.5', {
                            'dark:bg-theme-secondary-600 ': type === 'default',
                            'dark:bg-theme-green-700 ':
                                type === 'positive',
                            'dark:bg-theme-error-350 bg-theme-warning-150 text-theme-warning-750': type === 'negative',
                        })}
                    >
                        <Icon icon='information' className='h-2.5 w-2.5' />
                    </div>
                </Tooltip>
            )}
            <span className='px-1.5'>
                {amount}
            </span>
        </div>
    );
};
