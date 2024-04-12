import { useTranslation } from 'react-i18next';
import { ConfirmedTransactionData } from '@ardenthq/sdk/distribution/esm/confirmed-transaction.dto.contract';
import cn from 'classnames';
import { ReactNode } from 'react';
import dayjs from 'dayjs';
import { getTimeAgo } from '../../lib/utils/getTimeAgo';
import {
    Button,
    EmptyConnectionsIcon,
    ExternalLink,
    Icon,
    IconDefinition,
    Tooltip,
} from '@/shared/components';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import Amount from '@/components/wallet/Amount';
import trimAddress from '@/lib/utils/trimAddress';
import constants from '@/constants';

export const NoTransactions = () => {
    const { t } = useTranslation();

    return (
        <div className='mt-12 flex flex-col items-center justify-center gap-6'>
            <EmptyConnectionsIcon />
            <div className='max-w-40 text-center text-base font-normal leading-tight dark:text-white'>
                {t('PAGES.HOME.NO_TRANSACTIONS')}
            </div>
        </div>
    );
};

enum TransactionType {
    SEND = 'send',
    RECEIVE = 'receive',
    RETURN = 'return',
    SWAP = 'swap',
    VOTE = 'vote',
    UNVOTE = 'unvote',
    SECOND_SIGNATURE = 'second-signature',
    MULTISIGNATURE = 'multisignature',
    REGISTRATION = 'registration',
    RESIGNATION = 'resignation',
    OTHER = 'other',
}

const TransactionListItem = ({ transaction }: { transaction: ConfirmedTransactionData }) => {
    const primaryWallet = usePrimaryWallet();
    const { t } = useTranslation();

    const getType = (transaction: ConfirmedTransactionData): string => {
        if (transaction.isTransfer()) {
            const isSender = transaction.sender() === primaryWallet?.address();
            const isRecipient = transaction.recipient() === primaryWallet?.address();

            if (isSender && isRecipient) {
                return TransactionType.RETURN;
            } else if (isSender) {
                return TransactionType.SEND;
            } else {
                return TransactionType.RECEIVE;
            }
        }
        return TransactionType.OTHER;
    };

    const type = getType(transaction);

    const getTitle = (type: string): string => {
        switch (type) {
            case TransactionType.SEND:
                return t('COMMON.SENT');
            case TransactionType.RECEIVE:
                return t('COMMON.RECEIVED');
            case TransactionType.RETURN:
                return t('COMMON.RETURN');
            default:
                return t('COMMON.OTHER');
        }
    };

    const getSecondaryText = (
        transaction: ConfirmedTransactionData,
        type: string,
    ): string | ReactNode => {
        switch (type) {
            case TransactionType.SEND:
                return (
                    <Tooltip content={transaction.recipient()}>
                        <span>
                            {t('COMMON.TO')} {trimAddress(transaction.recipient(), 'short')}
                        </span>
                    </Tooltip>
                );
            case TransactionType.RECEIVE:
                return (
                    <Tooltip content={transaction.sender()}>
                        <span>
                            {t('COMMON.FROM')} {trimAddress(transaction.sender(), 'short')}
                        </span>
                    </Tooltip>
                );
            case TransactionType.RETURN:
                return t('COMMON.TO_SELF');
            default:
                return t('COMMON.CONTRACT');
        }
    };

    const timestamp = transaction.timestamp()?.toString() ?? '';
    const formattedTimestamp = dayjs(timestamp).format('DD MMM YYYY HH:mm:ss');

    return (
        <div className='transition-smoothEase flex h-[76px] w-full flex-row items-center justify-center gap-3 p-4 hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700'>
            <div className='flex h-11 min-w-11 items-center justify-center rounded-xl border border-theme-secondary-200 bg-white text-theme-secondary-500 dark:border-theme-secondary-600 dark:bg-subtle-black dark:text-theme-secondary-300'>
                <Icon
                    className={cn({
                        'h-[22px] w-[22px]': type === TransactionType.RETURN,
                        'h-8 w-8': type !== TransactionType.RETURN,
                    })}
                    icon={type as IconDefinition}
                />
            </div>

            <div className='flex w-full flex-row items-center justify-between'>
                <div className='flex flex-col gap-1'>
                    <p className='text-base font-medium leading-tight text-light-black dark:text-white'>
                        {getTitle(type)}
                    </p>
                    <span className='text-sm font-normal leading-tight text-theme-secondary-500 dark:text-theme-secondary-300'>
                        {getSecondaryText(transaction, type)}{' '}
                    </span>
                </div>

                <div className='flex flex-col items-end gap-1'>
                    <span className='text-base font-medium leading-tight text-light-black dark:text-white'>
                        <Amount
                            value={transaction.amount().toHuman()}
                            ticker={primaryWallet?.currency() ?? 'ARK'}
                            tooltipPlacement='bottom-end'
                            withTicker
                            showSign={type !== TransactionType.RETURN}
                            isNegative={type === TransactionType.SEND}
                            maxDecimals={2}
                        />
                    </span>
                    <span className='text-sm font-normal leading-tight text-theme-secondary-500 dark:text-theme-secondary-300'>
                        <Tooltip content={formattedTimestamp}>
                            <span>{getTimeAgo(timestamp ?? '')}</span>
                        </Tooltip>
                    </span>
                </div>
            </div>
        </div>
    );
};

export const TransactionsList = ({
    transactions,
    displayButton,
}: {
    transactions: ConfirmedTransactionData[];
    displayButton: boolean;
}) => {
    const primaryWallet = usePrimaryWallet();
    const { t } = useTranslation();

    return (
        <div className='custom-scroll max-h-[270px] overflow-auto'>
            {transactions.map((transaction, index) => (
                <TransactionListItem key={index} transaction={transaction} />
            ))}

            {displayButton && (
                <div className='p-4'>
                    <ExternalLink
                        href={
                            primaryWallet?.network().isLive()
                                ? `${constants.ARKSCAN_ADDRESSES}/${primaryWallet?.address()}`
                                : `${constants.ARKSCAN_TEST_ADDRESSES}/${primaryWallet?.address()}`
                        }
                        className='hover:no-underline'
                    >
                        <Button variant='secondary'>{t('COMMON.VIEW_MORE_ON_ARKSCAN')}</Button>
                    </ExternalLink>
                </div>
            )}
        </div>
    );
};
