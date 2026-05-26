import cn from 'classnames';
import { ReactNode } from 'react';

export const TransactionItem = ({
    children,
    className,
    title,
}: {
    children: ReactNode;
    className?: string;
    title: string;
}) => {
    return (
        <div
            className={cn(
                'border-y-theme-secondary-200 dark:border-theme-secondary-600 flex flex-col gap-2 border-t py-4 last:border-b',
                className,
            )}
        >
            <div className='text-theme-secondary-500 dark:text-theme-secondary-300 text-sm leading-tight font-medium'>
                {title}
            </div>
            <div className='text-light-black flex flex-row items-center gap-1.5 text-base font-normal dark:text-white'>
                {children}
            </div>
        </div>
    );
};
