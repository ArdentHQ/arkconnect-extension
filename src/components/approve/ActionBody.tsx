import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
import ActionDetails from './ActionDetails';
import { ActionAmountRow, ActionBodyRow, ActionTransactionIdRow } from './ActionBody.blocks';
import trimAddress from '@/lib/utils/trimAddress';

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
