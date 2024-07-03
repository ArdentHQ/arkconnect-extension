import { useEffect, useState } from 'react';
import { runtime } from 'webextension-polyfill';
import ThemedIcon from '@/shared/components/icon/ThemedIcon';

export const ShortcutIcon = () => {
    const [os, setOs] = useState<string>('default');

    useEffect(() => {
        const fetchPlatformInfo = async () => {
            const platformInfo = await runtime.getPlatformInfo();
            setOs(platformInfo.os);
        };

        fetchPlatformInfo();
    }, []);

    const icon = `shortcut-${os === 'mac' ? 'mac' : 'default'}`;
    
    return <ThemedIcon icon={icon} className='h-50 w-50' />;
};
