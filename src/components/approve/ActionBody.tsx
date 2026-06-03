import { useTranslation } from 'react-i18next';
import ActionDetails from './ActionDetails';
import {
    ActionAddressRow,
    ActionAmountRow,
    ActionBodyRow,
    ActionTransactionIdRow,
} from './ActionBody.blocks';

import { FeeWarning } from './CustomFeeAlerts.blocks';
import { Contracts } from '@/lib/profiles';
import trimAddress from '@/lib/utils/trimAddress';
import { BigNumber } from '@/lib/helpers';

type VoteData = {
    address?: string;
    name?: string;
    publicKey?: string;
};
interface ActionBodyProps {
    fee: BigNumber;
    network: string;
    amount?: BigNumber;
    amountTicker?: string;
    feeTicker?: string;
    isApproved?: boolean;
    actionDetailsClassName?: string;
    receiver?: string;
    sender?: string;
    totalAmount?: BigNumber;
    transactionId?: string;
    unvote?: VoteData;
    vote?: VoteData;
    wallet?: Contracts.IReadWriteWallet;
    hasHigherCustomFee?: string | null;
    hasLowerCustomFee?: string | null;
}

export const ActionBody = ({
    wallet,
    isApproved = false,
    sender,
    unvote,
    vote,
    transactionId,
    fee,
    network,
    actionDetailsClassName,
    amount,
    receiver,
    amountTicker,
    feeTicker,
    totalAmount,
    hasHigherCustomFee = null,
    hasLowerCustomFee = null,
}: ActionBodyProps) => {
    const { t } = useTranslation();

    const customFee = hasHigherCustomFee || hasLowerCustomFee;
    const customFeeState = customFee
        ? hasHigherCustomFee
            ? t('COMMON.HIGHER')
            : t('COMMON.LOWER')
        : null;
    const resolvedFeeTicker = feeTicker ?? amountTicker;
    const tickersDiffer = !!feeTicker && feeTicker !== amountTicker;

    return (
        <ActionDetails className={actionDetailsClassName}>
            {isApproved && <ActionAddressRow label={t('COMMON.SENDER')} address={sender ?? ''} />}

            {receiver && (
                <ActionAddressRow
                    label={t('COMMON.RECEIVER')}
                    address={receiver}
                    displayAddressBookName
                />
            )}

            {amount !== undefined && (
                <ActionAmountRow
                    label={t('COMMON.AMOUNT')}
                    amount={amount}
                    network={network}
                    amountTicker={amountTicker}
                />
            )}

            <ActionAmountRow
                label={
                    <span className='flex items-center gap-1'>
                        {t('COMMON.TRANSACTION_FEE')}{' '}
                        {customFee && resolvedFeeTicker && (
                            <FeeWarning
                                averageFee={customFee}
                                coin={resolvedFeeTicker}
                                customFeeState={customFeeState}
                            />
                        )}
                    </span>
                }
                amount={fee}
                amountTicker={resolvedFeeTicker}
                network={network}
            />

            {!tickersDiffer && totalAmount !== undefined && (
                <ActionAmountRow
                    label={t('COMMON.TOTAL_AMOUNT')}
                    amount={totalAmount}
                    amountTicker={amountTicker}
                    network={network}
                />
            )}

            {unvote?.name && (
                <ActionBodyRow label={t('COMMON.UNVOTE_VALIDATOR_NAME')} value={unvote.name} />
            )}

            {unvote?.publicKey && wallet?.isLedger() && (
                <ActionBodyRow
                    label={t('COMMON.UNVOTE_VALIDATOR_PUBKEY')}
                    value={
                        <span className='underline-offset-2 hover:underline'>
                            {trimAddress(unvote.publicKey ?? '', 10)}
                        </span>
                    }
                    tooltipContent={
                        <span className='block w-65 text-left break-words'>
                            {unvote.publicKey ?? ''}
                        </span>
                    }
                />
            )}

            {unvote?.address && !wallet?.isLedger() && (
                <ActionAddressRow
                    label={t('COMMON.UNVOTE_VALIDATOR_ADDRESS')}
                    address={unvote.address}
                />
            )}

            {vote?.name && (
                <ActionBodyRow label={t('COMMON.VOTE_VALIDATOR_NAME')} value={vote.name} />
            )}

            {vote?.publicKey && wallet?.isLedger() && (
                <ActionBodyRow
                    label={t('COMMON.VOTE_VALIDATOR_PUBKEY')}
                    value={
                        <span className='underline-offset-2 hover:underline'>
                            {trimAddress(vote.publicKey ?? '', 10)}
                        </span>
                    }
                    tooltipContent={
                        <span className='block w-65 text-left break-words'>
                            {vote.publicKey ?? ''}
                        </span>
                    }
                />
            )}

            {vote?.address && !wallet?.isLedger() && (
                <ActionAddressRow
                    label={t('COMMON.VOTE_VALIDATOR_ADDRESS')}
                    address={vote.address}
                />
            )}

            {isApproved && transactionId && (
                <ActionTransactionIdRow transactionId={transactionId} />
            )}
        </ActionDetails>
    );
};
