import { useRef } from 'react';
import { TippyProps } from '@tippyjs/react';
import Amount from '../Amount';
import { Alias, Icon, Paragraph, Tooltip } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';
import { ToastPosition } from '@/components/toast/ToastContainer';
import useClipboard from '@/lib/hooks/useClipboard';
import { useIsTruncated } from '@/lib/hooks/useIsTruncated';

export const AddressAlias = ({
    alias,
    withTooltip = false,
    isBold = false,
}: {
    alias: string;
    withTooltip?: boolean;
    isBold?: boolean;
}) => {
    const reference = useRef<HTMLDivElement | null>(null);
    const isTruncated = useIsTruncated({ reference });
    return (
        <div>
            <Tooltip content={alias} placement='top' disabled={!withTooltip || !isTruncated}>
                <Alias
                    fontWeight={isBold ? 'bold' : 'medium'}
                    maxWidth='180px'
                    className='typeset-headline text-light-black dark:text-white'
                    ref={reference}
                >
                    {alias}
                </Alias>
            </Tooltip>
        </div>
    );
};

export const LedgerIcon = () => {
    return (
        <Tooltip content='Ledger Address' placement='top'>
            <div className='flex text-theme-secondary-500 dark:text-theme-secondary-300'>
                <Icon icon='ledger-address' className='h-3.5 w-3.5' />
            </div>
        </Tooltip>
    );
};

export const TestnetIcon = () => {
    return (
        <div className='flex'>
            <Tooltip content='Testnet' placement='top'>
                <div className='flex h-4 w-4 items-center justify-center rounded border border-solid border-theme-warning-500 bg-theme-warning-50 text-theme-warning-500 dark:border-theme-warning-400 dark:bg-theme-warning-500/10 dark:text-theme-warning-400'>
                    <Paragraph $typeset='small'> T </Paragraph>
                </div>
            </Tooltip>
        </div>
    );
};

export const Address = ({
    address,
    length = 10,
    tooltipPlacement = 'top',
}: {
    address: string;
    length?: number;
    tooltipPlacement?: TippyProps['placement'];
}) => {
    return (
        <div>
            <Tooltip content={address} placement={tooltipPlacement}>
                <Paragraph
                    $typeset='body'
                    className='text-theme-secondary-500 dark:text-theme-secondary-300'
                >
                    {trimAddress(address, length)}
                </Paragraph>
            </Tooltip>
        </div>
    );
};

export const AddressWithCopy = ({ address, length = 10 }: { address: string; length?: number }) => {
    const { copy } = useClipboard();
    const trimmedAddress = trimAddress(address, length);

    return (
        <div
            className='cursor-pointer'
            onClick={() => {
                copy(address, trimmedAddress, ToastPosition.LOWER);
            }}
        >
            <Tooltip content='Copy address' placement='top'>
                <div className='flex items-center gap-1.5'>
                    <Paragraph
                        $typeset='body'
                        className='text-theme-secondary-500 dark:text-theme-secondary-300'
                    >
                        {trimmedAddress}
                    </Paragraph>
                    <Icon icon='copy' className='h-[13px] w-[13px]' />
                </div>
            </Tooltip>
        </div>
    );
};

export const AddressBalance = ({
    balance,
    currency,
    maxDigits = 5,
}: {
    balance: number;
    currency: string;
    maxDigits?: number;
}) => {
    return (
        <div className='text-theme-secondary-500 dark:text-theme-primary-300'>
            <Paragraph
                $typeset='body'
                className='text-theme-secondary-500 dark:text-theme-secondary-300'
            >
                <Amount value={balance} ticker={currency} maxDigits={maxDigits} withTicker />
            </Paragraph>
        </div>
    );
};
