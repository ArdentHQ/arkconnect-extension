import { ModalIcon } from '@/shared/components';
import useThemeMode from '@/lib/hooks/useThemeMode';

const ConnectionIndicator = ({ isConnected }: { isConnected: boolean }) => {
    const { currentThemeMode, getThemeColor } = useThemeMode();

    return (
        <ModalIcon
            color={isConnected ? getThemeColor('primary700', 'primary600') : 'gray'}
            icon={isConnected ? 'globe-with-dot' : 'globe'}
            iconClassName={isConnected ? `${currentThemeMode} globeIcon` : undefined}
        />
    );
};

export default ConnectionIndicator;
