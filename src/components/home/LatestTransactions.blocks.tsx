import { useTranslation } from 'react-i18next';
import { ConfirmedTransactionData } from '@ardenthq/sdk/distribution/esm/confirmed-transaction.dto.contract';
import cn from 'classnames';
import { ReactNode } from 'react';
import dayjs from 'dayjs';
import { getTimeAgo } from '../../lib/utils/getTimeAgo';
import { EmptyConnectionsIcon, Icon, IconDefinition, Tooltip } from '@/shared/components';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import Amount from '@/components/wallet/Amount';
import trimAddress from '@/lib/utils/trimAddress';

export const NoTransactions = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-12 flex flex-col items-center justify-center gap-6">
      <EmptyConnectionsIcon />
      <div className='max-w-40 leading-tight text-base font-normal text-center dark:text-white'>
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

    const getSecondaryText = (transaction: ConfirmedTransactionData, type: string): string | ReactNode => {
        switch (type) {
            case TransactionType.SEND:
                return (
                    <Tooltip
                        content={transaction.recipient()}
                    >
                        <span>
                            {t('COMMON.TO')} {trimAddress(transaction.recipient(), 'short')}
                        </span>
                    </Tooltip>
                );
            case TransactionType.RECEIVE:
                return (
                    <Tooltip
                        content={transaction.sender()}
                    >
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
        <div className='w-full h-[76px] p-4 flex flex-row justify-center items-center gap-3 hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700 transition-smoothEase'>
            <div className='h-11 min-w-11 border border-theme-secondary-200 rounded-xl flex items-center justify-center text-theme-secondary-500 dark:border-theme-secondary-600 dark:text-theme-secondary-300 dark:bg-subtle-black bg-white'>
                <Icon 
                    className={cn({
                        'h-[22px] w-[22px]': type === TransactionType.RETURN,
                        'h-8 w-8': type !== TransactionType.RETURN,
                    })} 
                    icon={type as IconDefinition} />
            </div>

            <div className='flex flex-row justify-between items-center w-full'>
                <div className='flex flex-col gap-1'>
                    <p className='text-base font-medium leading-tight text-light-black dark:text-white'>{getTitle(type)}</p>
                    <p className='text-theme-secondary-500 text-sm font-normal leading-tight dark:text-theme-secondary-300'>{getSecondaryText(transaction, type)} </p>
                </div>

                <div className='flex flex-col gap-1 items-end'>
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
                    <span className='text-theme-secondary-500 text-sm font-normal leading-tight dark:text-theme-secondary-300'>
                        <Tooltip
                            content={formattedTimestamp}
                        >
                            <span>
                                {getTimeAgo(timestamp ?? '')}
                            </span>
                        </Tooltip>
                    </span>
                </div>
            </div>
        </div>
    );
};

export const TransactionsList = ({ transactions }: { transactions: ConfirmedTransactionData[] }) => {
    return (
        <div className='max-h-65 overflow-auto custom-scroll'>
            {
                transactions.map((transaction, index) => (
                    <TransactionListItem key={index} transaction={transaction} />
                ))
            }
        </div>
    );
};