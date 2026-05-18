import cn from 'classnames';

export const Footer = ({
    className,
    children,
    variant = 'default',
}: {
    className?: string;
    children: React.ReactNode;
    variant?: 'default' | 'simple';
}) => {
    return (
        <div
            className={cn(
                {
                    'shadow-button-container dark:bg-subtle-black dark:shadow-button-container-dark bg-white p-4':
                        variant === 'default',
                    'p-4': variant === 'simple',
                },
                className,
            )}
        >
            {children}
        </div>
    );
};
