import { ModalIcon } from '@/shared/components';
import useThemeMode from '@/lib/hooks/useThemeMode';
import cn from 'classnames';

const ConnectionIndicator = ({ isConnected }: { isConnected: boolean }) => {
    const { currentThemeMode } = useThemeMode();

    return (
        <ModalIcon
            icon={isConnected ? 'globe-with-dot' : 'globe'}
            iconClassName={cn('', {
                [`${currentThemeMode} globeIcon`]: isConnected,
                'text-theme-primary-700 dark:text-theme-primary-600' : isConnected,
                'text-theme-secondary-500 dark:text-theme-secondary-300': !isConnected
            })}
        />
    );
};

export default ConnectionIndicator;
