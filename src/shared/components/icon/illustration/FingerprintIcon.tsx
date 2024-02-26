import useThemeMode from '@/lib/hooks/useThemeMode';
import { Icon } from '..';
import { ThemeMode } from '@/lib/store/ui';

export const FingerPrintIcon = () => {
  const { currentThemeMode } = useThemeMode();
  const icon = currentThemeMode === ThemeMode.LIGHT ? 'fingerprint-light' : 'fingerprint-dark';
  return <Icon icon={icon} width='200px' height='200px' />;
};
