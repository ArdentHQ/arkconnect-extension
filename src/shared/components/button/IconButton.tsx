import { twMerge } from 'tailwind-merge';
import cn from 'classnames';
import { Icon, IconDefinition } from '@/shared/components';

export const IconButton = ({
    icon,
    className,
    iconClassName,
    variant = 'default',
}: {
    icon: IconDefinition,
    className?: string,
    iconClassName?: string,
    variant?: 'default' | 'danger'
}) => {
  return (
    <div className={twMerge('h-8 w-8 rounded-full flex justify-center items-center group cursor-pointer transition-smoothEase', cn({
        'hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700': variant === 'default',
        'hover:bg-theme-error-50 dark:hover:bg-[#910018]/40': variant === 'danger',
    }), className)}>
        <Icon className={twMerge('w-5 h-5 text-light-black dark:text-white transition-smoothEase', cn({
            'group-hover:text-theme-error-600 dark:group-hover:text-theme-error-500': variant === 'danger',
        }), iconClassName)} icon={icon} />
    </div>
  );
};
