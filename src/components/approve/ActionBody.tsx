import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
import ActionDetails, { ActionDetailsFiatValue, ActionDetailsRow, ActionDetailsValue } from './ActionDetails';
import {  Icon, Tooltip } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';
import useClipboard from '@/lib/hooks/useClipboard';
import Amount from '@/components/wallet/Amount';

interface ActionBodyRowProps {
    label: string;
    value?: React.ReactNode;
    below?: React.ReactNode;
    tooltipContent?: React.ReactNode;
}

const ActionBodyRow = ({ label, below, value, tooltipContent }: ActionBodyRowProps) => (
    <ActionDetailsRow label={label} below={below}>
        {tooltipContent ? (
            <Tooltip content={tooltipContent} placement='bottom-end'>
                <ActionDetailsValue>{value}</ActionDetailsValue>
            </Tooltip>
        ) : (
            <ActionDetailsValue>{value}</ActionDetailsValue>
        )}
    </ActionDetailsRow>
);

const ActionAmountRow = ({
    label,
    showFiat,
    amount,
    convertedAmount,
    exchangeCurrency,
    amountTicker,
    network,
}: {
    label: string;
    showFiat: boolean;
    amount: number;
    convertedAmount: number;
    exchangeCurrency: string;
    amountTicker?: string;
    withTicker?: boolean;
    network?: string;
}) => {
    return (
        <ActionDetailsRow
            label={label}
            below={
                showFiat && (
                    <ActionDetailsFiatValue>
                        <Amount
                            value={convertedAmount}
                            ticker={exchangeCurrency}
                        />
                    </ActionDetailsFiatValue>
                )
            }
        >
            <div className='flex items-baseline gap-1'>
                <ActionDetailsValue>
                    {
                        amountTicker ? (
                            <Amount
                                value={amount}
                                ticker={amountTicker}
                                withTicker
                            />
                        ) : (
                            <span>
                                {amount} {network}
                            </span>
                        )
                    }
                </ActionDetailsValue>
            </div>
        </ActionDetailsRow>
    );
};

const ActionTransactionIdRow = ({
    transactionId,
}: {
    transactionId: string;
}) => {
    const { t } = useTranslation();
    const { copy } = useClipboard();

    return (
        <ActionDetailsRow label={t('COMMON.TRANSACTION_ID')}>
            <div className='flex items-center gap-1'>
                <ActionDetailsValue>
                    {trimAddress(transactionId, 'short')}
                </ActionDetailsValue>
                <button
                    type='button'
                    className='block'
                    onClick={() => copy(transactionId, t('COMMON.TRANSACTION_ID'))}
                >
                    <Icon
                        icon='copy'
                        className='h-5 w-5 text-theme-primary-700 dark:text-theme-primary-650'
                    />
                </button>
            </div>
        </ActionDetailsRow>
    );
}; 

type VoteData = {
    delegateAddress?: string;
    delegateName?: string;
    publicKey?: string;
}
interface ActionBodyProps {
    fee: number;
    convertedFee: number;
    exchangeCurrency: string;
    showFiat: boolean;
    network: string;
    amount?: number;
    amountTicker?: string;
    convertedAmount?: number;
    convertedTotalAmount?: number;
    isApproved?: boolean;
    maxHeight?: string;
    receiver?: string;
    sender?: string;
    totalAmount?: number;
    transactionId?: string;
    unvote?: VoteData;
    vote?: VoteData;
    wallet?: Contracts.IReadWriteWallet;
}

export const ActionBody = ({
    wallet,
    isApproved = false,
    sender,
    unvote,
    vote,
    transactionId,
    fee,
    convertedFee,
    showFiat,
    exchangeCurrency,
    network,
    maxHeight,
    amount,
    convertedAmount,
    receiver,
    amountTicker,
    totalAmount,
    convertedTotalAmount
}: ActionBodyProps) => {
    const { t } = useTranslation();

    return (
        <ActionDetails maxHeight={maxHeight}>
            {isApproved && (
                <ActionBodyRow
                    label={t('COMMON.SENDER')}
                    value={sender}
                />
            )}
            {
                (amount !== undefined && convertedAmount !== undefined) && (
                    <ActionAmountRow
                        label={t('COMMON.AMOUNT')}
                        showFiat={showFiat}
                        amount={amount}
                        convertedAmount={convertedAmount}
                        exchangeCurrency={exchangeCurrency}
                        network={network}
                        amountTicker={amountTicker}
                    />
                )
            }

            {
                receiver && (
                    <ActionBodyRow
                        label={t('COMMON.RECEIVER')}
                        value={receiver}
                    />
                )
            }

            <ActionAmountRow
                label={t('COMMON.TRANSACTION_FEE')}
                showFiat={showFiat}
                amount={fee}
                amountTicker={amountTicker}
                convertedAmount={convertedFee}
                exchangeCurrency={exchangeCurrency}
                network={network}
            />

            {
                (totalAmount !== undefined && convertedTotalAmount !== undefined) && (
                    <ActionAmountRow
                        label={t('COMMON.TOTAL_AMOUNT')}
                        amount={totalAmount}
                        amountTicker={amountTicker}
                        convertedAmount={convertedTotalAmount}
                        showFiat={showFiat}
                        exchangeCurrency={exchangeCurrency}
                        network={network}
                    />
                )
            }
            
            {
                unvote?.delegateName && (
                    <ActionBodyRow
                        label={t('COMMON.UNVOTE_DELEGATE_NAME')}
                        value={unvote.delegateName}
                    />
                )
            }

            {
                unvote?.publicKey && wallet?.isLedger() && (
                    <ActionBodyRow
                        label={t('COMMON.UNVOTE_DELEGATE_PUBKEY')}
                        value={trimAddress(unvote.publicKey ?? '', 10)}
                        tooltipContent={
                            <span className='block w-65 break-words text-left'>
                                {unvote.publicKey ?? ''}
                            </span>
                        }
                    />
                )
            }

            {
                unvote?.delegateAddress && !wallet?.isLedger() && (
                    <ActionBodyRow
                        label={t('COMMON.UNVOTE_DELEGATE_ADDRESS')}
                        value={trimAddress(unvote.delegateAddress ?? '', 10)}
                    />
                )
            }

            {
                vote?.delegateAddress && (
                    <ActionBodyRow
                        label={t('COMMON.VOTE_DELEGATE_NAME')}
                        value={vote.delegateName}
                    />
                )
            }

            {
                vote?.publicKey && wallet?.isLedger() && (
                    <ActionBodyRow
                        label={t('COMMON.VOTE_DELEGATE_PUBKEY')}
                        value={trimAddress(vote.publicKey ?? '', 10)}
                        tooltipContent={
                            <span className='block w-65 break-words text-left'>
                                {vote.publicKey ?? ''}
                            </span>
                        }
                    />
                )
            }

            {
                vote?.delegateAddress && !wallet?.isLedger() && (
                    <ActionBodyRow
                        label={t('COMMON.VOTE_DELEGATE_ADDRESS')}
                        value={trimAddress(vote.delegateAddress ?? '', 10)}
                    />
                )
            }

            {
                isApproved && transactionId && (
                    <ActionTransactionIdRow transactionId={transactionId} />
                )
            }
        </ActionDetails>
    );
};
