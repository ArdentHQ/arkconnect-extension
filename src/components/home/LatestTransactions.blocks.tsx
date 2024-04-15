import { useTranslation } from 'react-i18next';
import { ConfirmedTransactionData } from '@ardenthq/sdk/distribution/esm/confirmed-transaction.dto.contract';
import cn from 'classnames';
import dayjs from 'dayjs';
import {
    getAmountByAddress,
    getMultipaymentAmounts,
    getSecondaryText,
    getTitle,
    getType,
    getUniqueRecipients,
    TransactionType,
} from './LatestTransactions.utils';
import { getTimeAgo } from '@/lib/utils/getTimeAgo';
import { EmptyConnectionsIcon, Icon, IconDefinition, Tooltip } from '@/shared/components';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import Amount from '@/components/wallet/Amount';

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

const MultipaymentBadge = () => {
    const { t } = useTranslation();

    return (
        <span className='rounded bg-theme-secondary-200 px-1.5 py-0.5 text-xs font-medium leading-[15px] text-theme-secondary-600 dark:bg-theme-secondary-600 dark:text-theme-secondary-200'>
            {t('COMMON.MULTI')}
        </span>
    );
};

const TransactionListItem = ({ transaction }: { transaction: ConfirmedTransactionData }) => {
    const primaryWallet = usePrimaryWallet();

    const type = getType(transaction, primaryWallet);

    const timestamp = transaction.timestamp()?.toString() ?? '';
    const formattedTimestamp = dayjs(timestamp).format('DD MMM YYYY HH:mm:ss');

    const isSpecialTransaction = [
        TransactionType.REGISTRATION,
        TransactionType.RESIGNATION,
        TransactionType.OTHER,
        TransactionType.SECOND_SIGNATURE,
        TransactionType.MULTISIGNATURE,
    ].includes(type as TransactionType);

    const getTransactionIcon = (
        transaction: ConfirmedTransactionData,
        address?: string,
    ): IconDefinition => {
        const type = getType(transaction);

        if (type === TransactionType.MULTIPAYMENT) {
            return transaction.sender() === address ? 'send' : 'receive';
        }

        return type as IconDefinition;
    };

    const getTransactionAmount = (
        transaction: ConfirmedTransactionData,
        address?: string,
    ): string | JSX.Element => {
        const type = getType(transaction);
        const isMultipayment = type === TransactionType.MULTIPAYMENT;
        const isSender = transaction.sender() === address;
        const primaryCurrency = primaryWallet?.currency() ?? 'ARK';
        const amount = transaction.amount().toHuman();

        const renderAmount = (value: number, isNegative: boolean, showSign: boolean) => (
            <Amount
                value={value}
                ticker={primaryCurrency}
                tooltipPlacement='bottom-end'
                withTicker
                showSign={showSign}
                isNegative={isNegative}
                maxDecimals={2}
            />
        );

        if (isMultipayment) {
            const uniqueRecipients = getUniqueRecipients(transaction);

            if (isSender) {
                const { selfAmount, sentAmount } = getMultipaymentAmounts(
                    uniqueRecipients,
                    address,
                );
                const isSenderAndRecipient = uniqueRecipients.some(
                    (recipient) => recipient.address === address,
                );

                return (
                    <span className='flex flex-row gap-0.5'>
                        {renderAmount(sentAmount, true, sentAmount !== 0)}

                        {isSenderAndRecipient && (
                            <Tooltip
                                content={`Excluding ${selfAmount} ${primaryCurrency} sent to self`}
                            >
                                <div className='h-5 w-5 rounded-full bg-transparent p-0.5 text-subtle-white hover:bg-theme-secondary-50 dark:text-white dark:hover:bg-theme-secondary-700'>
                                    <Icon icon='information-circle' />
                                </div>
                            </Tooltip>
                        )}
                    </span>
                );
            } else {
                return renderAmount(getAmountByAddress(uniqueRecipients, address), false, true);
            }
        }

        return renderAmount(amount, type === TransactionType.SEND, type !== TransactionType.RETURN);
    };

    return (
        <div className='transition-smoothEase flex h-[76px] w-full flex-row items-center justify-center gap-3 p-4 hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700'>
            <div className='flex h-11 min-w-11 items-center justify-center rounded-xl border border-theme-secondary-200 bg-white text-theme-secondary-500 dark:border-theme-secondary-600 dark:bg-subtle-black dark:text-theme-secondary-300'>
                <Icon
                    className={cn({
                        'h-5 w-5': isSpecialTransaction,
                        'h-8 w-8': !isSpecialTransaction && type !== TransactionType.RETURN,
                        'h-[22px] w-[22px]':
                            !isSpecialTransaction && type === TransactionType.RETURN,
                    })}
                    icon={getTransactionIcon(transaction, primaryWallet?.address())}
                />
            </div>

            <div className='flex w-full flex-row items-center justify-between'>
                <div className='flex flex-col gap-1'>
                    <span className='text-base font-medium leading-tight text-light-black dark:text-white'>
                        {getTitle(type, transaction.sender() === primaryWallet?.address())}{' '}
                        {type === TransactionType.MULTIPAYMENT && <MultipaymentBadge />}
                    </span>
                    <span className='text-sm font-normal leading-tight text-theme-secondary-500 dark:text-theme-secondary-300'>
                        {getSecondaryText(
                            transaction,
                            type,
                            primaryWallet?.address(),
                            primaryWallet,
                        )}{' '}
                    </span>
                </div>

                <div className='flex flex-col items-end gap-1'>
                    <span className='text-base font-medium leading-tight text-light-black dark:text-white'>
                        {getTransactionAmount(transaction, primaryWallet?.address())}
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
}: {
    transactions: ConfirmedTransactionData[];
}) => {
    return (
        <div className='custom-scroll max-h-65 overflow-auto'>
            {transactions.map((transaction, index) => (
                <TransactionListItem key={index} transaction={transaction} />
            ))}
        </div>
    );
};
