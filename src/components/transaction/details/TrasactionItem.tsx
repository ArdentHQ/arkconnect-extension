
import cn  from 'classnames';
import { ReactNode } from 'react';

export const TrasactionItem = ({
    children,
    className,
    title,
}: {
    children: ReactNode;
    className?: string;
    title: string
}) => {
  return (
    <div className={cn('py-4 border-t flex flex-col gap-2 border-y-theme-secondary-200 dark:border-theme-secondary-600 last:border-b', className)}>
        <div className='text-sm font-medium leading-tight text-theme-secondary-500 dark:text-theme-secondary-300'>
            {title}
        </div>
        <div className='text-base font-normal text-light-black dark:text-white flex flex-row gap-1.5 items-center'>
            {children}
        </div>
    </div>
  );
};