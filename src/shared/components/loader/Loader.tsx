import cn from 'classnames';
import { twMerge } from 'tailwind-merge';

type LoaderProps = React.ComponentPropsWithRef<'span'> & {
    variant?: LoaderVariant;
};

type LoaderVariant = 'small' | 'big' | 'warning';

export const Loader = ({ variant, className, ...rest }: LoaderProps) => {
    return (
        <span
            className={twMerge(
                cn('animate-spin rounded-full border-solid', {
                    'h-6 w-6 border-2 border-transparent border-t-white': variant === 'small',
                    'border-theme-secondary-100 border-t-theme-primary-700 dark:border-subtle-black dark:border-t-theme-primary-650 h-16 w-16 border-[6px]':
                        variant === 'big',
                    'border-theme-warning-200 border-t-theme-warning-500 h-4.5 w-4.5 border-2':
                        variant === 'warning',
                }),
                className,
            )}
            {...rest}
        ></span>
    );
};
