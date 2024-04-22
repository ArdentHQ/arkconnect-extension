import cn from 'classnames';
import { ReactNode } from 'react';
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
    return (
        <div
            className={cn('flex items-center justify-center rounded-md border p-1.5', {
                'border-theme-secondary-500 text-light-black dark:border-theme-secondary-300 dark:text-white':
                    type === 'default',
                'border-theme-primary-700 text-theme-primary-700 dark:border-theme-primary-600 dark:text-theme-primary-600':
                    type === 'positive',
                'border-theme-error-600 text-theme-error-600 dark:border-theme-error-500 dark:text-theme-error-500':
                    type === 'negative',
            })}
        >
            {amount}


            {selfAmount && (
                <Tooltip
                    content={`Excluding ${selfAmount} sent to self`}
                >
                    <div className={cn('h-5 w-5 rounded-full bg-transparent p-0.5 ml-0.5', {
                        'text-light-black dark:text-white':
                            type === 'default',
                        'text-theme-primary-700  dark:text-theme-primary-600':
                            type === 'positive',
                        'text-theme-error-600 dark:text-theme-error-500':
                            type === 'negative',
                    })}>
                        <Icon icon='information-circle' />
                    </div>
                </Tooltip>
            )}
        </div>
    );
};
