import cn from 'classnames';

type LoaderProps = React.ComponentPropsWithRef<'span'> & {
    variant: LoaderVariant;
};

type LoaderVariant = 'small' | 'big' | 'warning';

export const Loader = ({ variant, ...rest }: LoaderProps) => {
    return (
        <span
            className={cn('rounded-full animate-spin border-solid', {
                'w-6 h-6 border-2 border-transparent border-t-white':
                    variant === 'small',
                'h-16 w-16 border-[6px] border-theme-secondary-100 dark:border-subtle-black border-t-theme-primary-700 dark:border-t-theme-primary-650':
                    variant === 'big',
                'w-4.5 h-4.5 border-2 border-theme-warning-200 border-t-theme-warning-500':
                    variant === 'warning',
            })}
            {...rest}
        ></span>
    );
};
