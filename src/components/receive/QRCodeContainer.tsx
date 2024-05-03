import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { generateReceiveUrl } from '@/lib/utils/generateReceiveURL';

export const QRCodeContainer = () => {
    const primaryWallet = usePrimaryWallet();
    const { t } = useTranslation();
    const { isDark } = useThemeMode();

    return (
        <div className='flex flex-col gap-1.5'>
            <span className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-200'>
                {t('COMMON.RECIPIENT')}
            </span>
            <div className='flex w-full items-center justify-center rounded-lg border border-theme-secondary-200 bg-white px-3 py-4 dark:border-theme-secondary-600 dark:bg-theme-secondary-800 dark:text-theme-secondary-400 dark:shadow-secondary-dark'>
                <QRCode
                    value={generateReceiveUrl({
                        coinName: primaryWallet?.network().coinName() ?? 'ARK',
                        netHash: primaryWallet?.network().meta().nethash,
                        address: primaryWallet?.address() ?? '',
                    })}
                    size={200}
                    bgColor={isDark() ? '#292929' : '#fff'}
                    fgColor={isDark() ? '#fff' : '#000'}
                />
            </div>
            <span className='text-sm font-normal text-theme-secondary-500 dark:text-theme-secondary-300'>
                {t('PAGES.RECEIVE.QR_CODE_WILL_BE_UPDATED_AUTOMATICALLY')}
            </span>
        </div>
    );
};
