import cn from 'classnames';

type LoaderProps = React.ComponentPropsWithRef<'span'> & {
    variant: LoaderVariant;
};

type LoaderVariant = 'small' | 'big' | 'warning';

export const Loader = ({ variant, ...rest }: LoaderProps) => {
    return (
        <span className={cn('rounded-full animate-spin', {
            'loader-small': variant === 'small',
            'loader-big': variant === 'big',
            'loader-warning': variant === 'warning',
        })} {...rest}></span>
    );
};
