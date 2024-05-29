import { twMerge } from 'tailwind-merge';
import cn from 'classnames';
import { ComponentPropsWithRef } from 'react';
import { Icon, IconDefinition } from '@/shared/components';

type IconButtonProps = ComponentPropsWithRef<'button'> & {
    icon: IconDefinition;
    className?: string;
    iconClassName?: string;
    variant?: 'default' | 'danger';
};

export const IconButton = ({
    icon,
    className,
    iconClassName,
    variant = 'default',
    ...rest
}: IconButtonProps) => {
    return (
        <button
            className={twMerge(
                'transition-smoothEase group flex h-8 w-8 cursor-pointer items-center justify-center rounded-full',
                cn({
                    'hover:bg-theme-secondary-200 dark:hover:bg-theme-secondary-500':
                        variant === 'default',
                    'hover:bg-theme-error-50 dark:hover:bg-[#910018]/40': variant === 'danger',
                }),
                className,
            )}
            {...rest}
        >
            <Icon
                className={twMerge(
                    'transition-smoothEase h-5 w-5 text-light-black dark:text-white',
                    cn({
                        'group-hover:text-theme-error-600 dark:group-hover:text-theme-error-500':
                            variant === 'danger',
                    }),
                    iconClassName,
                )}
                icon={icon}
            />
        </button>
    );
};
