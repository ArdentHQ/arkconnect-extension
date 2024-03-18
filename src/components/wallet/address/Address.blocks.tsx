import { useRef } from 'react';
import { TippyProps } from '@tippyjs/react';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import Amount from '../Amount';
import { Icon, Tooltip } from '@/shared/components';
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
                <div
                    className={classNames(
                        'typeset-headline max-w-[180px] truncate text-light-black dark:text-white',
                        {
                            'font-bold': isBold,
                            'font-medium': !isBold,
                        },
                    )}
                    ref={reference}
                >
                    {alias}
                </div>
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
                    <p className='typeset-small'> T </p>
                </div>
            </Tooltip>
        </div>
    );
};

export const Address = ({
    address,
    length = 10,
    tooltipPlacement = 'top',
    classNames,
}: {
    address: string;
    length?: number;
    tooltipPlacement?: TippyProps['placement'];
    classNames?: string;
}) => {
    return (
        <div>
            <Tooltip content={address} placement={tooltipPlacement}>
                <p
                    className={twMerge(
                        'max-w-44 text-sm font-normal leading-[17.5px] text-theme-secondary-500 underline-offset-2 hover:underline dark:text-theme-secondary-300',
                        classNames,
                    )}
                >
                    {trimAddress(address, length)}
                </p>
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
                    <p className='typeset-body text-theme-secondary-500 dark:text-theme-secondary-300'>
                        {trimmedAddress}
                    </p>
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
            <p className='typeset-body cursor-pointer text-theme-secondary-500 dark:text-theme-secondary-300'>
                <Amount
                    value={balance}
                    ticker={currency}
                    maxDigits={maxDigits}
                    withTicker
                    underlineOnHover={true}
                />
            </p>
        </div>
    );
};
