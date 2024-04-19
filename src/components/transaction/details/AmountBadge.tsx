import cn from 'classnames';
import { ReactNode } from 'react';

export const AmountBadge = ({
    amount,
    type = 'default',
}: {
    amount: ReactNode;
    type?: 'positive' | 'negative' | 'default';
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
        </div>
    );
};
