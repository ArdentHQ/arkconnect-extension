import { Icon } from '..';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { ThemeMode } from '@/lib/store/ui';

export const EmptyConnectionsIcon = () => {
    const { currentThemeMode } = useThemeMode();
    const icon =
        currentThemeMode === ThemeMode.LIGHT ? 'connections-empty-light' : 'connections-empty-dark';
    return <Icon icon={icon} className='h-30 w-30' />;
};
