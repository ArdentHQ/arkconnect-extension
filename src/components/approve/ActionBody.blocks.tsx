import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import cn from 'classnames';
import { Address } from '../wallet/address/Address.blocks';
import { CopyTransactionId } from '../transaction/details/CopyTransactionId';
import { ActionDetailsFiatValue, ActionDetailsRow } from './ActionDetails';
import { ActionDetailsValue } from './ActionDetailsValue';
import { Tooltip } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';
import Amount from '@/components/wallet/Amount';
import useAddressBook from '@/lib/hooks/useAddressBook';

interface ActionBodyRowProps {
    label: React.ReactNode;
    value?: React.ReactNode;
    below?: React.ReactNode;
    tooltipContent?: React.ReactNode;
    className?: string;
}

export const ActionBodyRow = ({
    label,
    below,
    value,
    tooltipContent,
    className,
}: ActionBodyRowProps) => (
    <ActionDetailsRow label={label} below={below}>
        {tooltipContent ? (
            <Tooltip content={tooltipContent} placement='bottom-end'>
                <ActionDetailsValue className={className}>{value}</ActionDetailsValue>
            </Tooltip>
        ) : (
            <ActionDetailsValue className={className}>{value}</ActionDetailsValue>
        )}
    </ActionDetailsRow>
);

interface ActionAmountRowProps {
    label: React.ReactNode;
    showFiat: boolean;
    amount: number;
    convertedAmount: number;
    exchangeCurrency: string;
    amountTicker?: string;
    withTicker?: boolean;
    network?: string;
    underlineOnHover?: boolean;
}

export const ActionAmountRow = ({
    label,
    showFiat,
    amount,
    convertedAmount,
    exchangeCurrency,
    amountTicker,
    network,
}: ActionAmountRowProps) => {
    return (
        <ActionDetailsRow
            label={label}
            below={
                showFiat && (
                    <ActionDetailsFiatValue>
                        <Amount
                            value={convertedAmount}
                            ticker={exchangeCurrency}
                            underlineOnHover={true}
                            tooltipPlacement='bottom-end'
                        />
                    </ActionDetailsFiatValue>
                )
            }
        >
            <div className='flex items-baseline gap-1'>
                <ActionDetailsValue>
                    {amountTicker ? (
                        <Amount
                            value={amount}
                            ticker={amountTicker}
                            withTicker
                            underlineOnHover={true}
                            tooltipPlacement='bottom-end'
                        />
                    ) : (
                        <span>
                            {amount} {network}
                        </span>
                    )}
                </ActionDetailsValue>
            </div>
        </ActionDetailsRow>
    );
};

export const ActionTransactionIdRow = ({ transactionId }: { transactionId: string }) => {
    const { t } = useTranslation();

    return (
        <ActionDetailsRow label={t('COMMON.TRANSACTION_ID')} className='items-center'>
            <div className='flex items-center gap-1'>
                <Tooltip content={transactionId} className='w-72 break-words'>
                    <ActionDetailsValue>{trimAddress(transactionId, 'short')}</ActionDetailsValue>
                </Tooltip>

                <CopyTransactionId transactionId={transactionId} />
            </div>
        </ActionDetailsRow>
    );
};

export const ActionAddressRow = ({
    label,
    address,
    displayAddressBookName = false,
}: {
    label: string;
    address: string;
    displayAddressBookName?: boolean;
}) => {
    const { findContact } = useAddressBook();
    const nameRef = useRef<HTMLSpanElement>(null);
    let contact;

    if (displayAddressBookName) {
        contact = findContact(address);
    }

    if (displayAddressBookName && contact) {
        return (
            <ActionDetailsRow label={label}>
                <div
                    className={cn('flex', {
                        'flex-col':
                            !nameRef?.current?.clientWidth || nameRef.current.clientWidth > 100,
                        'flex-row gap-1':
                            nameRef?.current?.clientWidth && nameRef.current.clientWidth <= 100,
                    })}
                    id='container'
                >
                    <span
                        className='w-fit text-right text-sm font-medium text-light-black dark:text-white'
                        ref={nameRef}
                    >
                        {contact.name}
                    </span>
                    <div className='flex flex-row justify-end text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                        (<Address address={address} tooltipPlacement='bottom-end' length={10} />)
                    </div>
                </div>
            </ActionDetailsRow>
        );
    }

    return (
        <ActionDetailsRow label={label}>
            <Address
                address={address}
                tooltipPlacement='bottom-end'
                length={10}
                className='font-medium leading-5 text-light-black dark:text-white'
            />
        </ActionDetailsRow>
    );
};
