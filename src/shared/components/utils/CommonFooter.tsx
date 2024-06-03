import cn from 'classnames';

export const CommonFooter = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                'bg-white p-4 shadow-button-container dark:bg-subtle-black dark:shadow-button-container-dark',
                className,
            )}
        >
            {children}
        </div>
    );
};
