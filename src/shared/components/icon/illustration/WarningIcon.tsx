import useThemeMode from '@/lib/hooks/useThemeMode';
import { Icon } from '..';
import { ThemeMode } from '@/lib/store/ui';

export const WarningIcon = ({
  width = '172px',
  height = '159px',
}: {
  width?: string;
  height?: string;
}) => {
  const { currentThemeMode } = useThemeMode();
  const icon = currentThemeMode === ThemeMode.LIGHT ? 'warning-light' : 'warning-dark';
  return <Icon icon={icon} width={width} height={height} />;
};
