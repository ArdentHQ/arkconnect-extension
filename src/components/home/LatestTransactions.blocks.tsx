import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import dayjs from 'dayjs';
import { ExtendedConfirmedTransactionData } from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
import { IReadWriteWallet } from '@ardenthq/sdk-profiles/distribution/esm/wallet.contract';
import {
    getAmountByAddress,
    getMultipaymentAmounts,
    getTransactionIcon,
    getType,
    getUniqueRecipients,
    renderAmount,
    TransactionType,
} from './LatestTransactions.utils';
import { getTimeAgo } from '@/lib/utils/getTimeAgo';
import {
    Button,
    EmptyConnectionsIcon,
    ExternalLink,
    Icon,
    InternalLink,
    Tooltip,
} from '@/shared/components';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { getExplorerDomain } from '@/lib/utils/networkUtils';
import { useDelegateInfo } from '@/lib/hooks/useDelegateInfo';
import trimAddress from '@/lib/utils/trimAddress';
import { Skeleton } from '@/shared/components/utils/Skeleton';

export const TransactionTitle = ({
    type,
    isSender = false,
}: {
    type: string;
    isSender: boolean;
}): string => {
    const { t } = useTranslation();

    switch (type) {
        case TransactionType.SEND:
            return t('COMMON.SENT');
        case TransactionType.RECEIVE:
            return t('COMMON.RECEIVED');
        case TransactionType.RETURN:
            return t('COMMON.RETURN');
        case TransactionType.SWAP:
            return t('COMMON.SWAP_VOTE');
        case TransactionType.VOTE:
            return t('COMMON.VOTE');
        case TransactionType.UNVOTE:
            return t('COMMON.UNVOTE');
        case TransactionType.SECOND_SIGNATURE:
            return t('COMMON.SECOND_SIGNATURE');
        case TransactionType.REGISTRATION:
            return t('COMMON.REGISTRATION');
        case TransactionType.RESIGNATION:
            return t('COMMON.RESIGNATION');
        case TransactionType.MULTISIGNATURE:
            return t('COMMON.MULTISIGNATURE');
        case TransactionType.MULTIPAYMENT:
            return isSender ? t('COMMON.SENT') : t('COMMON.RECEIVED');
        default:
            return t('COMMON.OTHER');
    }
};

const PaymentInfo = ({ address, isSent }: { address: string; isSent: boolean }) => {
    const { t } = useTranslation();

    return (
        <Tooltip content={address}>
            <span>
                {isSent ? t('COMMON.TO') : t('COMMON.FROM')} {trimAddress(address, 'short')}
            </span>
        </Tooltip>
    );
};

export const MultipaymentUniqueRecipients = ({
    transaction,
}: {
    transaction: ExtendedConfirmedTransactionData;
}): string | JSX.Element => {
    const { t } = useTranslation();
    const uniqueRecipients = getUniqueRecipients(transaction);
    const count = uniqueRecipients.length;

    return count > 1 ? (
        `${uniqueRecipients.length} ${t('COMMON.RECIPIENTS')}`
    ) : (
        <PaymentInfo address={uniqueRecipients[0].address} isSent={true} />
    );
};

export const TransactionSecondaryText = ({
    transaction,
    type,
    address,
    primaryWallet,
}: {
    transaction: ExtendedConfirmedTransactionData;
    type: string;
    address?: string;
    primaryWallet?: IReadWriteWallet;
}): string | JSX.Element => {
    const { t } = useTranslation();
    const { voteDelegate, unvoteDelegate } = useDelegateInfo(transaction, primaryWallet);

    switch (type) {
        case TransactionType.SEND:
            return <PaymentInfo address={transaction.recipient()} isSent={true} />;
        case TransactionType.RECEIVE:
            return <PaymentInfo address={transaction.sender()} isSent={false} />;
        case TransactionType.RETURN:
            return t('COMMON.TO_SELF');
        case TransactionType.SWAP:
            return voteDelegate ? (
                `${t('COMMON.TO')} ${voteDelegate.delegateName}`
            ) : (
                <Skeleton width={90} height={18} />
            );
        case TransactionType.VOTE:
            return voteDelegate ? voteDelegate.delegateName : <Skeleton width={90} height={18} />;
        case TransactionType.UNVOTE:
            return unvoteDelegate ? (
                unvoteDelegate.delegateName
            ) : (
                <Skeleton width={90} height={18} />
            );
        case TransactionType.MULTIPAYMENT:
            return transaction.sender() === address ? (
                <MultipaymentUniqueRecipients transaction={transaction} />
            ) : (
                <PaymentInfo address={transaction.sender()} isSent={false} />
            );
        default:
            return t('COMMON.CONTRACT');
    }
};

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

export const MultipaymentBadge = () => {
    const { t } = useTranslation();

    return (
        <span className='rounded bg-theme-secondary-200 px-1.5 py-0.5 text-xs font-medium leading-[15px] text-theme-secondary-600 dark:bg-theme-secondary-600 dark:text-theme-secondary-200'>
            {t('COMMON.MULTI')}
        </span>
    );
};

const TransactionListItem = ({
    transaction,
}: {
    transaction: ExtendedConfirmedTransactionData;
}) => {
    const primaryWallet = usePrimaryWallet();
    const type = getType(transaction);

    const timestamp = transaction.timestamp()?.toString() ?? '';
    const formattedTimestamp = dayjs(timestamp).format('DD MMM YYYY HH:mm:ss');

    const isSpecialTransaction = [
        TransactionType.REGISTRATION,
        TransactionType.RESIGNATION,
        TransactionType.OTHER,
        TransactionType.SECOND_SIGNATURE,
        TransactionType.MULTISIGNATURE,
    ].includes(type as TransactionType);

    return (
        <InternalLink to={`/transaction/${transaction.id()}`} className='hover:no-underline'>
            <div className='transition-smoothEase flex h-[76px] w-full flex-row items-center justify-center gap-3 p-4 hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700'>
                <div className='flex h-11 min-w-11 items-center justify-center rounded-xl border border-theme-secondary-200 bg-white text-theme-secondary-500 dark:border-theme-secondary-600 dark:bg-subtle-black dark:text-theme-secondary-300'>
                    <Icon
                        className={cn({
                            'h-5 w-5': isSpecialTransaction,
                            'h-8 w-8': !isSpecialTransaction && type !== TransactionType.RETURN,
                            'h-[22px] w-[22px]':
                                !isSpecialTransaction && type === TransactionType.RETURN,
                        })}
                        icon={getTransactionIcon(transaction)}
                    />
                </div>

                <div className='flex w-full flex-row items-center justify-between'>
                    <div className='flex flex-col gap-1'>
                        <span className='text-base font-medium leading-tight text-light-black dark:text-white'>
                            <TransactionTitle type={type} isSender={transaction.isSent()} />
                            {type === TransactionType.MULTIPAYMENT && (
                                <span className='ml-1.5'>
                                    <MultipaymentBadge />
                                </span>
                            )}
                        </span>
                        <span className='text-sm font-normal leading-tight text-theme-secondary-500 dark:text-theme-secondary-300'>
                            <TransactionSecondaryText
                                transaction={transaction}
                                type={type}
                                primaryWallet={primaryWallet}
                                address={primaryWallet?.address()}
                            />
                        </span>
                    </div>

                    <div className='flex flex-col items-end gap-1'>
                        <span className='text-base font-medium leading-tight text-light-black dark:text-white'>
                            <LatestTransactionAmount
                                transaction={transaction}
                                primaryCurrency={primaryWallet?.currency() ?? 'ARK'}
                                address={primaryWallet?.address()}
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
        </InternalLink>
    );
};

export const TransactionsList = ({
    transactions,
    displayButton,
}: {
    transactions: ExtendedConfirmedTransactionData[];
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
                        href={getExplorerDomain(
                            primaryWallet?.network().isLive() ?? false,
                            primaryWallet?.address() ?? '',
                        )}
                        className='hover:no-underline'
                    >
                        <Button variant='secondary'>{t('COMMON.VIEW_MORE_ON_ARKSCAN')}</Button>
                    </ExternalLink>
                </div>
            )}
        </div>
    );
};

export const LatestTransactionAmount = ({
    transaction,
    primaryCurrency,
    address,
}: {
    transaction: ExtendedConfirmedTransactionData;
    primaryCurrency: string;
    address?: string;
}): JSX.Element => {
    const { t } = useTranslation();
    const type = getType(transaction);
    const isMultipayment = type === TransactionType.MULTIPAYMENT;
    const amount = transaction.amount();
    const paymentTypes = [
        TransactionType.SEND,
        TransactionType.RECEIVE,
        TransactionType.RETURN,
        TransactionType.MULTIPAYMENT,
    ];
    if (!paymentTypes.includes(type as TransactionType)) {
        return (
            <span className='flex h-5 items-center justify-center'>
                <hr className='h-0.5 w-2 bg-theme-secondary-300 dark:bg-theme-secondary-500' />
            </span>
        );
    }

    if (isMultipayment) {
        const uniqueRecipients = getUniqueRecipients(transaction);

        if (transaction.isSent()) {
            const { selfAmount, sentAmount } = getMultipaymentAmounts(uniqueRecipients, address);
            const isSenderAndRecipient = uniqueRecipients.some(
                (recipient) => recipient.address === address,
            );

            return (
                <span className='flex flex-row gap-0.5'>
                    {renderAmount({
                        value: sentAmount,
                        isNegative: true,
                        showSign: sentAmount !== 0,
                        primaryCurrency,
                    })}

                    {isSenderAndRecipient && (
                        <Tooltip
                            content={t('COMMON.EXCLUDING_AMOUNT_TO_SELF', {
                                amount: `${selfAmount} ${primaryCurrency}`,
                            })}
                        >
                            <div className='h-5 w-5 rounded-full bg-transparent p-0.5 text-subtle-black hover:bg-theme-secondary-50 dark:text-white dark:hover:bg-theme-secondary-700'>
                                <Icon icon='information-circle' />
                            </div>
                        </Tooltip>
                    )}
                </span>
            );
        } else {
            return renderAmount({
                value: getAmountByAddress(uniqueRecipients, address),
                isNegative: false,
                showSign: true,
                primaryCurrency,
            });
        }
    }

    return renderAmount({
        value: amount,
        isNegative: type === TransactionType.SEND,
        showSign: type !== TransactionType.RETURN,
        primaryCurrency,
    });
};
