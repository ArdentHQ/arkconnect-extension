import { Icon } from '..';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { ThemeMode } from '@/lib/store/ui';

export const FingerPrintIcon = () => {
    const { currentThemeMode } = useThemeMode();
    const icon = currentThemeMode === ThemeMode.LIGHT ? 'fingerprint-light' : 'fingerprint-dark';
    return <Icon icon={icon} className='h-50 w-50' />;
};
