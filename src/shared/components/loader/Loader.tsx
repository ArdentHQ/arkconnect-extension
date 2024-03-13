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
                    'h-16 w-16 border-[6px] border-theme-secondary-100 border-t-theme-primary-700 dark:border-subtle-black dark:border-t-theme-primary-650':
                        variant === 'big',
                    'h-4.5 w-4.5 border-2 border-theme-warning-200 border-t-theme-warning-500':
                        variant === 'warning',
                }),
                className,
            )}
            {...rest}
        ></span>
    );
};
