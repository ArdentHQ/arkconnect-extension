import { forwardRef, HTMLAttributes } from 'react';
import cn from 'classnames';
import { twMerge } from 'tailwind-merge';

interface HeaderButtonProps extends HTMLAttributes<HTMLButtonElement> {
    selected?: boolean;
}
export const HeaderButton = forwardRef<HTMLButtonElement, HeaderButtonProps>(
    ({ selected = false, className, ...properties }, ref) => {
        return (
            <button
                ref={ref}
                type='button'
                className={twMerge(
                    cn(
                        'flex cursor-pointer items-center gap-1 overflow-auto rounded-lg p-2 text-light-black transition duration-200 ease-in-out dark:text-white',
                        {
                            'bg-theme-secondary-50 dark:bg-theme-secondary-700': selected,
                            'hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700':
                                !selected,
                        },
                    ),
                    className,
                )}
                {...properties}
            />
        );
    },
);
HeaderButton.displayName = 'HeaderButton';
