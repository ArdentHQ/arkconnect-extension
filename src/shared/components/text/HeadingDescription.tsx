
import cn from 'classnames';

interface HeadlineProps extends React.HTMLAttributes<HTMLParagraphElement> {
    className?: string
}

export const HeadingDescription = ({ className, ...rest }: HeadlineProps) => {
  return (
    <p className={cn('typeset-headline text-theme-secondary-500 dark:text-theme-secondary-300', className)} {...rest} />
  );
};
