import { Icon } from '..';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { ThemeMode } from '@/lib/store/ui';

export const LockIcon = () => {
    const { currentThemeMode } = useThemeMode();
    const icon = currentThemeMode === ThemeMode.LIGHT ? 'lock-light' : 'lock-dark';
    return <Icon icon={icon} className='h-[190px] w-[190px]' />;
};
