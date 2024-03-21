import cn from 'classnames';
import { isFirefox } from '@/lib/utils/isFirefox';

interface Properties extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const NavButton = ({ className, ...properties }: Properties) => {
    return (
        <button
            className={cn(
                'rounded-[50px] p-1.75 enabled:hover:bg-theme-secondary-100 dark:enabled:hover:bg-theme-secondary-700',
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
