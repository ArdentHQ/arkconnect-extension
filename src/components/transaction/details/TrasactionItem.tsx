import cn from 'classnames';
import { ReactNode } from 'react';

export const TrasactionItem = ({
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
                'flex flex-col gap-2 border-t border-y-theme-secondary-200 py-4 last:border-b dark:border-theme-secondary-600',
                className,
            )}
        >
            <div className='text-sm font-medium leading-tight text-theme-secondary-500 dark:text-theme-secondary-300'>
                {title}
            </div>
            <div className='flex flex-row items-center gap-1.5 text-base font-normal text-light-black dark:text-white'>
                {children}
            </div>
        </div>
    );
};
