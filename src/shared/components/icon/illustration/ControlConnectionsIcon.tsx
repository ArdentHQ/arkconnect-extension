import { Icon } from '..';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { ThemeMode } from '@/lib/store/ui';

export const ControlConnectionsIcon = () => {
    const { currentThemeMode } = useThemeMode();
    const icon = currentThemeMode === ThemeMode.LIGHT ? 'connections-light' : 'connections-dark';
    return <Icon icon={icon} className='h-50 w-50' />;
};
