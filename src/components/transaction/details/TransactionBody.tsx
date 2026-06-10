import { useTranslation } from 'react-i18next';
import {
    TransactionAddress,
    TransactionAmount,
    TransactionUniqueRecipients,
} from '../Transaction.blocks';
import { CopyTransactionId } from './CopyTransactionId';
import { TransactionItem } from './TransactionItem';
import { Tooltip } from '@/shared/components';
import { getType, renderAmount, TransactionType } from '@/components/home/LatestTransactions.utils';

import Amount from '@/components/wallet/Amount';
import { formatUnixTimestamp } from '@/lib/utils/formatUnixTimestsamp';
import trimAddress from '@/lib/utils/trimAddress';
import { useValidatorInfo } from '@/lib/hooks/useValidatorInfo';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { ExtendedConfirmedTransactionData } from '@/lib/profiles/transaction.dto';

export const TransactionBody = ({
    transaction,
}: {
    transaction: ExtendedConfirmedTransactionData;
}) => {
    const primaryWallet = usePrimaryWallet();
    const { t } = useTranslation();
    const { voteValidator } = useValidatorInfo(transaction, primaryWallet);
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
                <TransactionItem title={t('COMMON.SENDER')}>
                    <TransactionAddress address={transaction.from()} />
                </TransactionItem>

                {paymentTypes.includes(type) && (
                    <TransactionItem title={t('COMMON.RECIPIENT')}>
                        {type === TransactionType.MULTIPAYMENT ? (
                            <TransactionUniqueRecipients transaction={transaction} />
                        ) : (
                            <TransactionAddress address={transaction.to()} />
                        )}
                    </TransactionItem>
                )}

                {paymentTypes.includes(type) && (
                    <TransactionItem title={t('COMMON.AMOUNT')}>
                        <TransactionAmount transaction={transaction} />
                    </TransactionItem>
                )}

                {[TransactionType.VOTE].includes(type) && (
                    <TransactionItem title={t('COMMON.VOTE')}>
                        {voteValidator.name}
                        <Tooltip content={voteValidator.address} className='break-words'>
                            <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                                {trimAddress(voteValidator.address, 10)}
                            </span>
                        </Tooltip>
                    </TransactionItem>
                )}

                {type === TransactionType.REGISTRATION && (
                    <TransactionItem title={t('COMMON.VALIDATOR_NAME')}>
                        {transaction.username() ?? ''}
                    </TransactionItem>
                )}

                {type === TransactionType.RESIGNATION && (
                    <TransactionItem title={t('COMMON.VALIDATOR_NAME')}>
                        {transaction.wallet().username() ?? ''}
                    </TransactionItem>
                )}

                <TransactionItem title={t('COMMON.TRANSACTION_FEE')}>
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
                </TransactionItem>

                <TransactionItem title={t('COMMON.TIMESTAMP')}>
                    {formatUnixTimestamp(transaction.timestamp()?.toUNIX() ?? 0)}
                </TransactionItem>

                {type === TransactionType.MULTISIGNATURE && (
                    <TransactionItem title={t('COMMON.MULTISIGNATURE_PARTICIPANTS')}>
                        {t('COMMON.PARTICIPANT', { count: transaction.publicKeys().length })}
                    </TransactionItem>
                )}

                {type === TransactionType.MULTISIGNATURE && (
                    <TransactionItem title={t('COMMON.MINIMUN_REQUIRED_SIGNATURES')}>
                        {transaction.min()} / {transaction.publicKeys().length}
                    </TransactionItem>
                )}

                {type === TransactionType.MULTISIGNATURE && (
                    <TransactionItem title={t('COMMON.MULTISIGNATURE_ADDRESS')}>
                        {trimAddress(transaction.from(), 'short')}
                    </TransactionItem>
                )}

                <TransactionItem title={t('COMMON.TRANSACTION_ID')}>
                    <div className='flex w-full flex-row items-center justify-between'>
                        <Tooltip content={transaction.hash()} className='break-words'>
                            <span>{trimAddress(transaction.hash(), 'longest')}</span>
                        </Tooltip>
                        <CopyTransactionId transactionId={transaction.hash()} />
                    </div>
                </TransactionItem>
            </div>
        </div>
    );
};
