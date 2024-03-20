import { Contracts } from '@ardenthq/sdk-profiles';
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
    return (
        <ActionDetails maxHeight='165px'>
            <ActionDetailsRow
                label='Transaction Fee'
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
                <ActionDetailsRow label='Unvote Delegate Name'>
                    <ActionDetailsValue>{unvote.wallet?.username() ?? ''}</ActionDetailsValue>
                </ActionDetailsRow>
            )}

            {unvote && !wallet.isLedger() && (
                <ActionDetailsRow label='Unvote Delegate Address'>
                    <ActionDetailsValue>
                        {trimAddress(unvote.wallet?.address() ?? '', 10)}
                    </ActionDetailsValue>
                </ActionDetailsRow>
            )}

            {unvote && wallet.isLedger() && (
                <ActionDetailsRow label='Unvote Delegate Pubkey'>
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
                <ActionDetailsRow label='Vote Delegate Name'>
                    <ActionDetailsValue>{vote.wallet?.username() ?? ''}</ActionDetailsValue>
                </ActionDetailsRow>
            )}

            {vote && !wallet.isLedger() && (
                <ActionDetailsRow label='Vote Delegate Address'>
                    <ActionDetailsValue>
                        {trimAddress(vote.wallet?.address() ?? '', 10)}
                    </ActionDetailsValue>
                </ActionDetailsRow>
            )}

            {vote && wallet.isLedger() && (
                <ActionDetailsRow label='Vote Delegate Pubkey'>
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
