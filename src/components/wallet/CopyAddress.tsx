import { Icon, Tooltip } from '@/shared/components';
import { StyledFlexContainer } from '@/shared/components/header/Header';
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
            <StyledFlexContainer
                borderRadius='50'
                padding='8'
                className='c-pointer'
                onClick={() => {
                    copy(primaryWallet.address(), trimmedAddress, ToastPosition.LOWER);
                }}
                as='button'
                color='base'
            >
                <Icon icon='copy' className={'h-4 w-4'} />
            </StyledFlexContainer>
        </Tooltip>
    );
};
