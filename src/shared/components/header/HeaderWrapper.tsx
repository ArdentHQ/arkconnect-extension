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
                    'dark:bg-subtle-black fixed top-0 left-0 z-20 flex w-full items-center justify-center bg-white px-0 py-3',
                    {
                        'shadow-light dark:shadow-dark': withShadow,
                    },
                ),
                className,
            )}
            {...properties}
        />
    );
};
