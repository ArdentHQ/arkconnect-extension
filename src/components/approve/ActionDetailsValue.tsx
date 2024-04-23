import { forwardRef } from 'react';

export const ActionDetailsValue = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
    ({ children }, ref) => {
        return (
            <div ref={ref} className='text-sm font-medium text-light-black dark:text-white truncate pl-10'>
                {children}
            </div>
        );
    },
);

ActionDetailsValue.displayName = 'ActionDetailsValue';
