import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
import ActionDetails from './ActionDetails';
import {
    ActionAddressRow,
    ActionAmountRow,
    ActionBodyRow,
    ActionTransactionIdRow,
} from './ActionBody.blocks';

import { FeeWarning } from './CustomFeeAlerts.blocks';
import trimAddress from '@/lib/utils/trimAddress';
import constants from '@/constants';

type VoteData = {
    address?: string;
    name?: string;
    publicKey?: string;
};
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
    actionDetailsClassName?: string;
    receiver?: string;
    sender?: string;
    totalAmount?: number;
    transactionId?: string;
    unvote?: VoteData;
    vote?: VoteData;
    wallet?: Contracts.IReadWriteWallet;
    hasHigherCustomFee?: number | null;
    hasLowerCustomFee?: number | null;
    memo?: string | null;
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
    actionDetailsClassName,
    amount,
    convertedAmount,
    receiver,
    amountTicker,
    totalAmount,
    convertedTotalAmount,
    hasHigherCustomFee = null,
    hasLowerCustomFee = null,
    memo = null,
}: ActionBodyProps) => {
    const { t } = useTranslation();

    const customFee = hasHigherCustomFee || hasLowerCustomFee;
    const customFeeState = customFee
        ? hasHigherCustomFee
            ? constants.FEE_HIGHER
            : constants.FEE_LOWER
        : null;

    return (
        <ActionDetails className={actionDetailsClassName}>
            {isApproved && <ActionAddressRow label={t('COMMON.SENDER')} address={sender ?? ''} />}

            {amount !== undefined && convertedAmount !== undefined && (
                <ActionAmountRow
                    label={t('COMMON.AMOUNT')}
                    showFiat={showFiat}
                    amount={amount}
                    convertedAmount={convertedAmount}
                    exchangeCurrency={exchangeCurrency}
                    network={network}
                    amountTicker={amountTicker}
                />
            )}

            {receiver && (
                <ActionAddressRow
                    label={t('COMMON.RECEIVER')}
                    address={receiver}
                    displayAddressBookName
                />
            )}
            {memo && (
                <ActionBodyRow
                    label={t('COMMON.MEMO')}
                    value={memo}
                    className='truncate pl-20'
                    tooltipContent={memo}
                />
            )}

            <ActionAmountRow
                label={
                    <span className='flex items-center gap-1'>
                        {t('COMMON.TRANSACTION_FEE')}{' '}
                        {customFee && amountTicker && (
                            <FeeWarning
                                averageFee={customFee}
                                coin={amountTicker}
                                customFeeState={customFeeState}
                            />
                        )}
                    </span>
                }
                showFiat={showFiat}
                amount={fee}
                amountTicker={amountTicker}
                convertedAmount={convertedFee}
                exchangeCurrency={exchangeCurrency}
                network={network}
            />

            {totalAmount !== undefined && convertedTotalAmount !== undefined && (
                <ActionAmountRow
                    label={t('COMMON.TOTAL_AMOUNT')}
                    amount={totalAmount}
                    amountTicker={amountTicker}
                    convertedAmount={convertedTotalAmount}
                    showFiat={showFiat}
                    exchangeCurrency={exchangeCurrency}
                    network={network}
                />
            )}

            {unvote?.name && (
                <ActionBodyRow label={t('COMMON.UNVOTE_DELEGATE_NAME')} value={unvote.name} />
            )}

            {unvote?.publicKey && wallet?.isLedger() && (
                <ActionBodyRow
                    label={t('COMMON.UNVOTE_DELEGATE_PUBKEY')}
                    value={
                        <span className='underline-offset-2 hover:underline'>
                            {trimAddress(unvote.publicKey ?? '', 10)}
                        </span>
                    }
                    tooltipContent={
                        <span className='block w-65 break-words text-left'>
                            {unvote.publicKey ?? ''}
                        </span>
                    }
                />
            )}

            {unvote?.address && !wallet?.isLedger() && (
                <ActionAddressRow
                    label={t('COMMON.UNVOTE_DELEGATE_ADDRESS')}
                    address={unvote.address}
                />
            )}

            {vote?.address && (
                <ActionBodyRow label={t('COMMON.VOTE_DELEGATE_NAME')} value={vote.name} />
            )}

            {vote?.publicKey && wallet?.isLedger() && (
                <ActionBodyRow
                    label={t('COMMON.VOTE_DELEGATE_PUBKEY')}
                    value={
                        <span className='underline-offset-2 hover:underline'>
                            {trimAddress(vote.publicKey ?? '', 10)}
                        </span>
                    }
                    tooltipContent={
                        <span className='block w-65 break-words text-left'>
                            {vote.publicKey ?? ''}
                        </span>
                    }
                />
            )}

            {vote?.address && !wallet?.isLedger() && (
                <ActionAddressRow
                    label={t('COMMON.VOTE_DELEGATE_ADDRESS')}
                    address={vote.address}
                />
            )}

            {isApproved && transactionId && (
                <ActionTransactionIdRow transactionId={transactionId} />
            )}
        </ActionDetails>
    );
};
