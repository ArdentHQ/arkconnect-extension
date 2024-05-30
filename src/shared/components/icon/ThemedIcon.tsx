import { Icon, IconDefinition, IconProps } from '@/shared/components';
import useThemeMode from '@/lib/hooks/useThemeMode';

interface Props extends Omit<IconProps, 'icon'> {
    icon: string;
}

const ThemedIcon = ({ icon, ...props }: Props) => {
    const { currentThemeMode, currentThemeAccent } = useThemeMode();

    const iconName = `${icon}-${currentThemeMode}-${currentThemeAccent}` as IconDefinition;

    return <Icon icon={iconName} {...props} />;
};

export default ThemedIcon;
