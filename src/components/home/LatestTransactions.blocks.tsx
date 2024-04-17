import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import dayjs from 'dayjs';
import { ExtendedConfirmedTransactionData } from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
import { getTimeAgo } from '../../lib/utils/getTimeAgo';
import {
    getSecondaryText,
    getTitle,
    getTransactionAmount,
    getTransactionIcon,
    getType,
    TransactionType,
} from './LatestTransactions.utils';
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
                            {getTitle(type, transaction.isSent())}{' '}
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
                            {getTransactionAmount(
                                transaction,
                                primaryWallet?.currency() ?? 'ARK',
                                primaryWallet?.address(),
                            )}
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
