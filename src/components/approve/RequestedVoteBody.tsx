import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
import ActionDetails, {
    ActionDetailsFiatValue,
    ActionDetailsRow,
    ActionDetailsValue,
} from './ActionDetails';
import Amount from '@/components/wallet/Amount';
import { Tooltip } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';

type Props = {
    vote: Contracts.VoteRegistryItem | null;
    unvote: Contracts.VoteRegistryItem | null;
    fee: number;
    convertedFee: number;
    wallet: Contracts.IReadWriteWallet;
};

const RequestedVoteBody = ({ vote, unvote, fee, convertedFee, wallet }: Props) => {
    const { t } = useTranslation();

    return (
        <ActionDetails maxHeight='165px'>
            <ActionDetailsRow
                label={t('COMMON.TRANSACTION_FEE')}
                below={
                    wallet.network().isLive() && (
                        <ActionDetailsFiatValue>
                            <Amount
                                value={convertedFee}
                                ticker={wallet.exchangeCurrency() ?? 'USD'}
                            />
                        </ActionDetailsFiatValue>
                    )
                }
            >
                <div className='flex items-baseline gap-1'>
                    <ActionDetailsValue>
                        {fee} {getNetworkCurrency(wallet.network())}
                    </ActionDetailsValue>
                </div>
            </ActionDetailsRow>

            {unvote && (
                <ActionDetailsRow label={t('COMMON.UNVOTE_DELEGATE_NAME')}>
                    <ActionDetailsValue>{unvote.wallet?.username() ?? ''}</ActionDetailsValue>
                </ActionDetailsRow>
            )}

            {unvote && !wallet.isLedger() && (
                <ActionDetailsRow label={t('COMMON.UNVOTE_DELEGATE_ADDRESS')}>
                    <ActionDetailsValue>
                        {trimAddress(unvote.wallet?.address() ?? '', 10)}
                    </ActionDetailsValue>
                </ActionDetailsRow>
            )}

            {unvote && wallet.isLedger() && (
                <ActionDetailsRow label={t('COMMON.UNVOTE_DELEGATE_PUBKEY')}>
                    <Tooltip
                        content={
                            <span className='block w-65 break-words text-left'>
                                {unvote.wallet?.publicKey() ?? ''}
                            </span>
                        }
                        placement='bottom-end'
                    >
                        <ActionDetailsValue>
                            {trimAddress(unvote.wallet?.publicKey() ?? '', 10)}
                        </ActionDetailsValue>
                    </Tooltip>
                </ActionDetailsRow>
            )}

            {vote && (
                <ActionDetailsRow label={t('COMMON.VOTE_DELEGATE_NAME')}>
                    <ActionDetailsValue>{vote.wallet?.username() ?? ''}</ActionDetailsValue>
                </ActionDetailsRow>
            )}

            {vote && !wallet.isLedger() && (
                <ActionDetailsRow label={t('COMMON.VOTE_DELEGATE_ADDRESS')}>
                    <ActionDetailsValue>
                        {trimAddress(vote.wallet?.address() ?? '', 10)}
                    </ActionDetailsValue>
                </ActionDetailsRow>
            )}

            {vote && wallet.isLedger() && (
                <ActionDetailsRow label={t('COMMON.VOTE_DELEGATE_PUBKEY')}>
                    <Tooltip
                        content={
                            <span className='block w-65 break-words text-left'>
                                {vote.wallet?.publicKey() ?? ''}
                            </span>
                        }
                        placement='bottom-end'
                    >
                        <ActionDetailsValue>
                            {trimAddress(vote.wallet?.publicKey() ?? '', 10)}
                        </ActionDetailsValue>
                    </Tooltip>
                </ActionDetailsRow>
            )}
        </ActionDetails>
    );
};

export default RequestedVoteBody;
