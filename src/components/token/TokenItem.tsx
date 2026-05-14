import { ReactNode } from 'react';
import cn from 'classnames';

export const TokenItem = ({
    label,
    children,
    className,
}: {
    label: string;
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                'border-t-1 dark:border-theme-subtle-black border-inset flex flex-row items-center justify-between border-theme-secondary-200 py-3 first:border-none dark:border-theme-secondary-700',
                className,
            )}
        >
            <span className='text-sm font-medium leading-[1.125rem] text-theme-secondary-500 dark:text-theme-secondary-300'>
                {label}
            </span>

            <span className='flex items-center text-sm font-medium leading-[1.125rem] text-light-black dark:text-white'>
                {children}
            </span>
        </div>
    );
};
