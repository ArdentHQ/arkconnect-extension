import { Icon } from '..';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { ThemeMode } from '@/lib/store/ui';

export const SmallWarningIcon = () => {
    const { currentThemeMode } = useThemeMode();
    const icon =
        currentThemeMode === ThemeMode.LIGHT ? 'warning-small-light' : 'warning-small-dark';
    return <Icon icon={icon} className='h-[76px] w-[76px]' />;
};
