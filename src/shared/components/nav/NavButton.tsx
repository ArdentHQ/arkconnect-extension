import cn from 'classnames';
import { isFirefox } from '@/lib/utils/isFirefox';

interface Properties extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const NavButton = ({ className, ...properties }: Properties) => {
    return (
        <button
            className={cn(
                'rounded-12.5 p-1.75 enabled:hover:bg-theme-secondary-100 dark:enabled:hover:bg-theme-secondary-700',
                {
                    'transition-firefoxSmoothEase': isFirefox,
                    'transition-smoothEase': !isFirefox,
                },
                className,
            )}
            {...properties}
        />
    );
};
