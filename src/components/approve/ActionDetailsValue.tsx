import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export const ActionDetailsValue = forwardRef<HTMLDivElement, { children: React.ReactNode, className?: string }>(
    ({ children, className }, ref) => {
        return (
            <div ref={ref} className={twMerge('text-sm font-medium text-light-black dark:text-white', className)}>
                {children}
            </div>
        );
    },
);

ActionDetailsValue.displayName = 'ActionDetailsValue';
