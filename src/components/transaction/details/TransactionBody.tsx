import { useTranslation } from 'react-i18next';
import { ExtendedConfirmedTransactionData } from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
import { TransactionAddress } from '../Transaction.blocks';
import { TrasactionItem } from './TrasactionItem';
import { AmountBadge } from './AmountBadge';
import { Button, ExternalLink, Icon } from '@/shared/components';
import useClipboard from '@/lib/hooks/useClipboard';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { getExplorerDomain } from '@/lib/utils/networkUtils';
import trimAddress from '@/lib/utils/trimAddress';
import { getType, renderAmount, TransactionType } from '@/components/home/LatestTransactions.utils';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';

export const TransactionBody = ({
    transaction,
}: {
    transaction: ExtendedConfirmedTransactionData;
}) => {
    const { t } = useTranslation();
    const { copy } = useClipboard();

    const primaryWallet = usePrimaryWallet();

    const badgeType = transaction.isReturn()
        ? 'default'
        : transaction.isReceived()
          ? 'positive'
          : 'negative';

    const { convert } = useExchangeRate({
        exchangeTicker: primaryWallet?.exchangeCurrency(),
        ticker: primaryWallet?.currency(),
    });

    const type = getType(transaction) as TransactionType;
    const paymentTypes = [TransactionType.SEND, TransactionType.RECEIVE, TransactionType.RETURN];

    return (
        <div className='flex flex-col gap-4 pb-4'>
            <div>
                <TrasactionItem title={t('COMMON.SENDER')}>
                    <TransactionAddress address={transaction.sender()} />
                </TrasactionItem>

                {paymentTypes.includes(type) && (
                    <TrasactionItem title={t('COMMON.RECIPIENT')}>
                        <TransactionAddress address={transaction.recipient()} />
                    </TrasactionItem>
                )}

                {paymentTypes.includes(type) && (
                    <TrasactionItem title={t('COMMON.AMOUNT')}>
                        <AmountBadge
                            amount={renderAmount({
                                value: transaction.amount(),
                                isNegative: transaction.isSent(),
                                showSign: !transaction.isReturn(),
                                primaryCurrency: primaryWallet?.currency() ?? 'ARK',
                            })}
                            type={badgeType}
                        />
                        <span className='pl-0.5 text-theme-secondary-500 dark:text-theme-secondary-300'>
                            {convert(transaction.amount())}
                        </span>
                    </TrasactionItem>
                )}

                <TrasactionItem title={t('COMMON.TRANSACTION_FEE')}>
                    {renderAmount({
                        value: transaction.fee(),
                        isNegative: false,
                        showSign: false,
                        primaryCurrency: primaryWallet?.currency() ?? 'ARK',
                    })}
                    <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                        {convert(transaction.fee())}
                    </span>
                </TrasactionItem>

                <TrasactionItem title={t('COMMON.TIMESTAMP')}>
                    {transaction.timestamp()?.toString() ?? ''}
                </TrasactionItem>

                <TrasactionItem title={t('COMMON.TRANSACTION_ID')}>
                    <div className='flex w-full flex-row items-center justify-between'>
                        <span>{trimAddress(transaction.id(), 'longest')}</span>
                        <button
                            type='button'
                            className='block'
                            onClick={() => copy(transaction.id(), t('COMMON.TRANSACTION_ID'))}
                        >
                            <Icon
                                icon='copy'
                                className='h-5 w-5 text-theme-primary-700 dark:text-theme-primary-650'
                            />
                        </button>
                    </div>
                </TrasactionItem>

                {paymentTypes.includes(type) && (
                    <TrasactionItem title={t('COMMON.MEMO')}>
                        <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                            {transaction.memo() ?? t('COMMON.NOT_AVAILABLE')}
                        </span>
                    </TrasactionItem>
                )}
            </div>
            <div>
                <ExternalLink
                    href={getExplorerDomain(
                        primaryWallet?.network().isLive() ?? false,
                        primaryWallet?.address() ?? '',
                    )}
                    className='hover:no-underline'
                >
                    <Button variant='secondary'>{t('COMMON.VIEW_ON_ARKSCAN')}</Button>
                </ExternalLink>
            </div>
        </div>
    );
};