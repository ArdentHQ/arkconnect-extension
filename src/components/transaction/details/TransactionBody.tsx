import { useTranslation } from 'react-i18next';
import { ExtendedConfirmedTransactionData } from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
import { TransactionAddress } from '../Transaction.blocks';
import { TrasactionItem } from './TrasactionItem';
import { AmountBadge } from './AmountBadge';
import { Button, ExternalLink, Icon } from '@/shared/components';
import useClipboard from '@/lib/hooks/useClipboard';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import trimAddress from '@/lib/utils/trimAddress';
import { getType, renderAmount, TransactionType } from '@/components/home/LatestTransactions.utils';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';
import { getTransactionDetailLink } from '@/lib/utils/networkUtils';

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

                {type === TransactionType.REGISTRATION && (
                    <TrasactionItem title={t('COMMON.DELEGATE_NAME')}>
                        {transaction.username() ?? ''}
                    </TrasactionItem>
                )}

                {type === TransactionType.RESIGNATION && (
                    <TrasactionItem title={t('COMMON.DELEGATE_NAME')}>
                        {transaction.wallet().username() ?? ''}
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

                {type === TransactionType.OTHER && (
                    <TrasactionItem title={t('COMMON.IPFS_HASH')}>
                        <span className='[overflow-wrap:anywhere]'>{transaction.hash()}</span>
                    </TrasactionItem>
                )}

                <TrasactionItem title={t('COMMON.TIMESTAMP')}>
                    {transaction.timestamp()?.toString() ?? ''}
                </TrasactionItem>

                {type === TransactionType.MULTISIGNATURE && (
                    <TrasactionItem title={t('COMMON.MULTISIGNATURE_PARTICIPANTS')}>
                        {t('COMMON.PARTICIPANT', { count: transaction.publicKeys().length })}
                    </TrasactionItem>
                )}

                {type === TransactionType.MULTISIGNATURE && (
                    <TrasactionItem title={t('COMMON.MINIMUN_REQUIRED_SIGNATURES')}>
                        {transaction.min()} / {transaction.publicKeys().length}
                    </TrasactionItem>
                )}

                {type === TransactionType.MULTISIGNATURE && (
                    <TrasactionItem title={t('COMMON.MULTISIGNATURE_ADDRESS')}>
                        {trimAddress(transaction.sender(), 'short')}
                    </TrasactionItem>
                )}

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
                    href={getTransactionDetailLink(
                        primaryWallet?.network().isLive() ?? false,
                        transaction.id(),
                    )}
                    className='hover:no-underline'
                >
                    <Button variant='secondary'>{t('COMMON.VIEW_ON_ARKSCAN')}</Button>
                </ExternalLink>
            </div>
        </div>
    );
};
