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
            className={cn(
                'flex items-center justify-center overflow-hidden rounded border text-sm font-bold',
                {
                    'border-theme-secondary-100 bg-theme-secondary-100 text-theme-secondary-500 dark:border-theme-secondary-600 dark:bg-transparent dark:text-theme-secondary-300':
                        type === 'default',
                    'border-[#E2F0E6] bg-[#E2F0E6] text-[#307845] dark:border-[#307845] dark:bg-transparent dark:text-[#42B263]':
                        type === 'positive',
                    'border-theme-warning-75 bg-theme-warning-75 text-theme-warning-750 dark:border-theme-error-350 dark:bg-transparent dark:text-theme-error-300':
                        type === 'negative',
                },
            )}
        >
            {selfAmount && (
                <Tooltip content={t('COMMON.EXCLUDING_AMOUNT_TO_SELF', { amount: selfAmount })}>
                    <div
                        className={cn('px-1.5 py-1.5 dark:text-white', {
                            'dark:bg-theme-secondary-600': type === 'default',
                            'dark:bg-theme-green-700': type === 'positive',
                            'bg-theme-warning-150 text-theme-warning-750 dark:bg-theme-error-350':
                                type === 'negative',
                        })}
                    >
                        <Icon icon='information' className='h-2.5 w-2.5' />
                    </div>
                </Tooltip>
            )}
            <span className='px-1.5'>{amount}</span>
        </div>
    );
};
