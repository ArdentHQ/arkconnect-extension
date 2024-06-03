import cn from 'classnames';

export const CommonFooter = ({
    className,
    children,
    variant = 'default'
}: {
    className?: string;
    children: React.ReactNode;
    variant?: 'default' | 'simple';
}) => {
  return ( 
    <div className={cn({
      'bg-white p-4 shadow-button-container dark:bg-subtle-black dark:shadow-button-container-dark': variant === 'default',
      'p-4': variant === 'simple'
      }, className)}>
      {children}
    </div>
  );
};
