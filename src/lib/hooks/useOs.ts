import { useEffect, useState } from 'react';
import { runtime } from 'webextension-polyfill';
import constants from '@/constants';

export const useOs = (): { os: string } => {
    const [os, setOs] = useState<string>(constants.DEFAULT_OS);

    useEffect(() => {
        const fetchPlatformInfo = async () => {
            const platformInfo = await runtime.getPlatformInfo();
            setOs(platformInfo.os);
        };

        fetchPlatformInfo();
    }, []);

    return { os };
};
