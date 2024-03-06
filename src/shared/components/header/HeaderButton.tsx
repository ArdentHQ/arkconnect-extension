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
                        'p-2 gap-1 items-center flex rounded-lg overflow-auto cursor-pointer transition duration-200 ease-in-out text-light-black dark:text-white',
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
