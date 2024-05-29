import cn from 'classnames';
import { Icon, IconDefinition } from '@/shared/components';

export const QRActionButtons = ({
    className,
    onClick,
    text,
    icon
}: {
    className?: string
    onClick?: () => void
    text: string
    icon: IconDefinition
}) => {
  return (
    <button className={cn('px-5 py-1 flex flex-row gap-3 dark:text-theme-secondary-200 dark:hover:text-white text-light-black hover:text-theme-secondary-600 items-center text-base font-medium transition-smoothEase', className)} onClick={onClick}>
        <Icon icon={icon} className='h-5 w-5' />
        {text}
    </button>
  );
};
