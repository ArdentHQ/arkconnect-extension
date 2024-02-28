import { Icon } from '..';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { ThemeMode } from '@/lib/store/ui';

export const SmallWarningIcon = () => {
    const { currentThemeMode } = useThemeMode();
    const icon =
        currentThemeMode === ThemeMode.LIGHT ? 'warning-small-light' : 'warning-small-dark';
    return <Icon icon={icon} width='76px' height='76px' />;
};
