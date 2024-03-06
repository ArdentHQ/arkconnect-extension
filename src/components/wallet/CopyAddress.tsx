import { Icon, Tooltip } from '@/shared/components';
import { HeaderButton } from '@/shared/components/header/Header';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import useClipboard from '@/lib/hooks/useClipboard';
import trimAddress from '@/lib/utils/trimAddress';
import { ToastPosition } from '@/components/toast/ToastContainer';

export const CopyAddress = () => {
    const primaryWallet = usePrimaryWallet();

    const { copy } = useClipboard();

    if (!primaryWallet) {
        return <></>;
    }

    const trimmedAddress = trimAddress(primaryWallet.address(), 7);

    return (
        <Tooltip content='Copy address' placement='bottom-end'>
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
