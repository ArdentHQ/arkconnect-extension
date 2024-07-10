import ThemedIcon from '@/shared/components/icon/ThemedIcon';
import { useOs } from '@/lib/hooks/useOs';
import constants from '@/constants';

export const ShortcutIcon = () => {
    const { os } = useOs();

    const icon = `shortcut-${os === constants.MAC_OS ? 'mac' : 'default'}`;

    return <ThemedIcon icon={icon} className='h-50 w-50' />;
};
