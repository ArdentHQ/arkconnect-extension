import cn from 'classnames';
import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface HeaderWrapperProps extends HTMLAttributes<HTMLDivElement> {
    withShadow?: boolean;
}

export const HeaderWrapper = ({ withShadow, className, ...properties }: HeaderWrapperProps) => {
    return (
        <header
            className={twMerge(
                cn(
                    'fixed top-0 left-0 w-full z-20 flex justify-center items-center py-3 px-0 bg-white dark:bg-subtle-black',
                    {
                        'shadow-header dark:shadow-header-dark': withShadow,
                    },
                ),
                className,
            )}
            {...properties}
        />
    );
};
