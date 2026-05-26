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
                'dark:border-theme-subtle-black border-inset border-theme-secondary-200 dark:border-theme-secondary-700 flex flex-row items-center justify-between border-t-1 py-3 first:border-none',
                className,
            )}
        >
            <span className='text-theme-secondary-500 dark:text-theme-secondary-300 text-sm leading-[1.125rem] font-medium'>
                {label}
            </span>

            <span className='text-light-black flex items-center text-sm leading-[1.125rem] font-medium dark:text-white'>
                {children}
            </span>
        </div>
    );
};
