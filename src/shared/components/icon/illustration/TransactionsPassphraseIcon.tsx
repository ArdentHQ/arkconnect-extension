import { Icon } from '..';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { ThemeMode } from '@/lib/store/ui';

export const TransactionsPassphraseIcon = () => {
    const { currentThemeMode } = useThemeMode();
    const icon =
        currentThemeMode === ThemeMode.LIGHT
            ? 'transactions-passphrase-light'
            : 'transactions-passphrase-dark';
    return <Icon icon={icon} width='200px' height='200px' />;
};
