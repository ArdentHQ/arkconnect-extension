import { ExtendedConfirmedTransactionData } from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
import { useTranslation } from 'react-i18next';
import {
    TransactionAddress,
    TransactionAmount,
    TransactionUniqueRecipients,
} from '../Transaction.blocks';
import { TrasactionItem } from './TrasactionItem';
import { CopyTransactionId } from './CopyTransactionId';
import { Button, ExternalLink, Tooltip } from '@/shared/components';
import { getType, renderAmount, TransactionType } from '@/components/home/LatestTransactions.utils';

import Amount from '@/components/wallet/Amount';
import { formatUnixTimestamp } from '@/lib/utils/formatUnixTimestsamp';
import { getTransactionDetailLink } from '@/lib/utils/networkUtils';
import trimAddress from '@/lib/utils/trimAddress';
import { useDelegateInfo } from '@/lib/hooks/useDelegateInfo';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';

export const TransactionBody = ({
    transaction,
}: {
    transaction: ExtendedConfirmedTransactionData;
}) => {
    const primaryWallet = usePrimaryWallet();
    const { t } = useTranslation();
    const { voteDelegate, unvoteDelegate } = useDelegateInfo(transaction, primaryWallet);
    const { convert } = useExchangeRate({
        exchangeTicker: primaryWallet?.exchangeCurrency(),
        ticker: primaryWallet?.currency(),
    });

    const type = getType(transaction) as TransactionType;
    const paymentTypes = [
        TransactionType.SEND,
        TransactionType.RECEIVE,
        TransactionType.RETURN,
        TransactionType.MULTIPAYMENT,
    ];

    return (
        <div className='flex flex-col gap-4 pb-4'>
            <div>
                <TrasactionItem title={t('COMMON.SENDER')}>
                    <TransactionAddress address={transaction.sender()} />
                </TrasactionItem>

                {paymentTypes.includes(type) && (
                    <TrasactionItem title={t('COMMON.RECIPIENT')}>
                        {type === TransactionType.MULTIPAYMENT ? (
                            <TransactionUniqueRecipients transaction={transaction} />
                        ) : (
                            <TransactionAddress address={transaction.recipient()} />
                        )}
                    </TrasactionItem>
                )}

                {paymentTypes.includes(type) && (
                    <TrasactionItem title={t('COMMON.AMOUNT')}>
                        <TransactionAmount transaction={transaction} />
                    </TrasactionItem>
                )}

                {[TransactionType.UNVOTE, TransactionType.SWAP].includes(type) && (
                    <TrasactionItem title={t('COMMON.UNVOTE')}>
                        {unvoteDelegate.name}
                        <Tooltip content={unvoteDelegate.address} className='break-words'>
                            <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                                {trimAddress(unvoteDelegate.address, 10)}
                            </span>
                        </Tooltip>
                    </TrasactionItem>
                )}

                {[TransactionType.VOTE, TransactionType.SWAP].includes(type) && (
                    <TrasactionItem title={t('COMMON.VOTE')}>
                        {voteDelegate.name}
                        <Tooltip content={voteDelegate.address} className='break-words'>
                            <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                                {trimAddress(voteDelegate.address, 10)}
                            </span>
                        </Tooltip>
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
                    <div className='flex w-full items-center justify-between'>
                        {renderAmount({
                            value: transaction.fee(),
                            isNegative: false,
                            showSign: false,
                            primaryCurrency: primaryWallet?.currency() ?? 'ARK',
                        })}
                        {!primaryWallet?.network().isTest() && (
                            <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                                <Amount
                                    value={convert(transaction.fee())}
                                    ticker={primaryWallet?.exchangeCurrency() ?? 'USD'}
                                    underlineOnHover={true}
                                />
                            </span>
                        )}
                    </div>
                </TrasactionItem>

                {type === TransactionType.OTHER && (
                    <TrasactionItem title={t('COMMON.IPFS_HASH')}>
                        <span className='[overflow-wrap:anywhere]'>{transaction.hash()}</span>
                    </TrasactionItem>
                )}

                <TrasactionItem title={t('COMMON.TIMESTAMP')}>
                    {formatUnixTimestamp(transaction.timestamp()?.toUNIX() ?? 0)}
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
                        <Tooltip content={transaction.id()} className='break-words'>
                            <span>{trimAddress(transaction.id(), 'longest')}</span>
                        </Tooltip>
                        <CopyTransactionId transactionId={transaction.id()} />
                    </div>
                </TrasactionItem>

                {paymentTypes.includes(type) && (
                    <TrasactionItem title={t('COMMON.MEMO')}>
                        {transaction.memo() ?? (
                            <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                                {t('COMMON.NOT_AVAILABLE')}
                            </span>
                        )}
                    </TrasactionItem>
                )}
            </div>
            <div>
                <ExternalLink
                    href={getTransactionDetailLink(
                        primaryWallet?.network().isLive() ?? false,
                        transaction.id(),
                    )}
                    className='group hover:no-underline'
                >
                    <Button
                        variant='secondary'
                        className='group-focus-visible:shadow-focus dark:group-focus-visible:shadow-focus-dark'
                    >
                        {t('COMMON.VIEW_ON_ARKSCAN')}
                    </Button>
                </ExternalLink>
            </div>
        </div>
    );
};
