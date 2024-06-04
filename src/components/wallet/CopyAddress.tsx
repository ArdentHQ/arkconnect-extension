import { useTranslation } from 'react-i18next';
import { Icon, Tooltip } from '@/shared/components';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import useClipboard from '@/lib/hooks/useClipboard';
import trimAddress from '@/lib/utils/trimAddress';
import { ToastPosition } from '@/components/toast/ToastContainer';
import { HeaderButton } from '@/shared/components/header/HeaderButton';

export const CopyAddress = () => {
    const primaryWallet = usePrimaryWallet();
    const { t } = useTranslation();

    const { copy } = useClipboard();

    if (!primaryWallet) {
        return <></>;
    }

    const trimmedAddress = trimAddress(primaryWallet.address(), 10);

    return (
        <Tooltip content={t('COMMON.COPY_with_name', { name: 'Address' })} placement='bottom-end'>
            <HeaderButton
                className='rounded-full'
                onClick={() => {
                    copy(primaryWallet.address(), trimmedAddress, ToastPosition.LOWER);
                }}
            >
                <Icon icon='copy' className={'h-4 w-4'} />
            </HeaderButton>
        </Tooltip>
    );
};
