import cn from 'classnames';

type ExternalLinkProps = React.ComponentPropsWithRef<'a'> & {
    className?: string;
};

export const ExternalLink = ({ className, ...rest }: ExternalLinkProps) => {
    return (
        <a
            className={cn(
                'cursor-pointer no-underline hover:underline focus-visible:outline-2 focus-visible:outline-theme-primary-600',
                className,
            )}
            {...rest}
        />
    );
};
