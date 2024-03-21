import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
import { Network } from '@ardenthq/sdk/distribution/esm/network';
import ActionDetails, {
    ActionDetailsFiatValue,
    ActionDetailsRow,
    ActionDetailsValue,
} from './../ActionDetails';
import {  Icon, Tooltip } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';
import useClipboard from '@/lib/hooks/useClipboard';
import Amount from '@/components/wallet/Amount';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';

interface VoteBodyRowProps {
    label: string;
    value?: React.ReactNode;
    below?: React.ReactNode;
    tooltipContent?: React.ReactNode;
}

const VoteBodyRow = ({ label, below, value, tooltipContent }: VoteBodyRowProps) => (
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

const VoteFeeRow = ({
    showFiat,
    fee,
    convertedFee,
    exchangeCurrency,
    walletNetwork
}: {
    showFiat: boolean;
    fee: number;
    convertedFee: number;
    exchangeCurrency: string;
    walletNetwork: Network;
}) => {
    const { t } = useTranslation();

    return (
        <ActionDetailsRow
            label={t('COMMON.TRANSACTION_FEE')}
            below={
                showFiat && (
                    <ActionDetailsFiatValue>
                        <Amount
                            value={convertedFee}
                            ticker={exchangeCurrency}
                        />
                    </ActionDetailsFiatValue>
                )
            }
        >
            <div className='flex items-baseline gap-1'>
                <ActionDetailsValue>
                    {fee} {getNetworkCurrency(walletNetwork)}
                </ActionDetailsValue>
            </div>
        </ActionDetailsRow>
    );
};

const VoteTransactionRow = ({
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

interface VoteBodyProps {
    wallet: Contracts.IReadWriteWallet;
    isApproved?: boolean;
    sender?: string;
    unvote?: VoteData;
    vote?: VoteData;
    transactionId?: string;
    showFiat: boolean;
    convertedFee: number;
    exchangeCurrency: string;
    fee: number;
    walletNetwork: Network;
    maxHeight?: string;
}

export const VoteBody = ({ wallet, isApproved = false, sender, unvote, vote, transactionId, fee, convertedFee, showFiat, exchangeCurrency, walletNetwork, maxHeight }: VoteBodyProps) => {
    const { t } = useTranslation();

    return (
        <ActionDetails maxHeight={maxHeight}>
            {isApproved && (
                <VoteBodyRow
                    label={t('COMMON.SENDER')}
                    value={sender}
                />
            )}

            <VoteFeeRow
                showFiat={showFiat}
                fee={fee}
                convertedFee={convertedFee}
                exchangeCurrency={exchangeCurrency}
                walletNetwork={walletNetwork}
            />
            
            {
                unvote && (
                    <VoteBodyRow
                        label={t('COMMON.UNVOTE_DELEGATE_NAME')}
                        value={unvote.delegateName}
                    />
                )
            }

            {
                unvote && wallet.isLedger() && (
                    <VoteBodyRow
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
                unvote && !wallet.isLedger() && (
                    <VoteBodyRow
                        label={t('COMMON.UNVOTE_DELEGATE_ADDRESS')}
                        value={trimAddress(unvote.delegateAddress ?? '', 10)}
                    />
                )
            }

            {
                vote && (
                    <VoteBodyRow
                        label={t('COMMON.VOTE_DELEGATE_NAME')}
                        value={vote.delegateName}
                    />
                )
            }

            {
                vote && wallet.isLedger() && (
                    <VoteBodyRow
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
                vote && !wallet.isLedger() && (
                    <VoteBodyRow
                        label={t('COMMON.VOTE_DELEGATE_ADDRESS')}
                        value={trimAddress(vote.delegateAddress ?? '', 10)}
                    />
                )
            }

            {
                isApproved && transactionId && (
                    <VoteTransactionRow transactionId={transactionId}
                    />
                )
            }
        </ActionDetails>
    );
};
