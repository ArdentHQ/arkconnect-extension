import { Icon } from '..';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { ThemeMode } from '@/lib/store/ui';

export const WarningIcon = ({
    iconClassName = 'w-[172px] h-[159px]',
}: {
    iconClassName?: string,
}) => {
    const { currentThemeMode } = useThemeMode();
    const icon = currentThemeMode === ThemeMode.LIGHT ? 'warning-light' : 'warning-dark';
    return <Icon icon={icon} className={iconClassName} />;
};
