import cn from 'classnames';
import { Icon, IconDefinition } from '@/shared/components';

export const QRActionButtons = ({
    className,
    onClick,
    text,
    icon,
}: {
    className?: string;
    onClick?: () => void;
    text: string;
    icon: IconDefinition;
}) => {
    return (
        <button
            className={cn(
                'transition-smoothEase flex flex-row items-center gap-3 px-5 py-1 text-base font-medium text-light-black hover:bg-theme-secondary-50 dark:text-theme-secondary-200 dark:hover:bg-theme-secondary-700 rounded-2xl',
                className,
            )}
            onClick={onClick}
        >
            <Icon icon={icon} className='h-5 w-5' />
            {text}
        </button>
    );
};
