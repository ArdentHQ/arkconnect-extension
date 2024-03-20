import { useLocation } from 'react-router-dom';
import { Contracts } from '@ardenthq/sdk-profiles';
import ActionDetails, {
    ActionDetailsFiatValue,
    ActionDetailsRow,
    ActionDetailsValue,
} from './ActionDetails';
import Amount from '@/components/wallet/Amount';
import useClipboard from '@/lib/hooks/useClipboard';
import trimAddress from '@/lib/utils/trimAddress';
import { Icon, Tooltip } from '@/shared/components';
import getActiveCoin from '@/lib/utils/getActiveCoin';
import { WalletNetwork } from '@/lib/store/wallet';

const VoteApprovedBody = ({ wallet }: { wallet: Contracts.IReadWriteWallet }) => {
    const { state } = useLocation();
    const { copy } = useClipboard();

    const showFiat = state.walletNetwork === WalletNetwork.MAINNET;
    return (
        <div className='w-full'>
            <ActionDetails maxHeight='229px'>
                <ActionDetailsRow label='Sender'>
                    <ActionDetailsValue>
                        {trimAddress(state?.vote.sender ?? '', 10)}
                    </ActionDetailsValue>
                </ActionDetailsRow>

                <ActionDetailsRow
                    label='Transaction Fee'
                    below={
                        showFiat && (
                            <ActionDetailsFiatValue>
                                <Amount
                                    value={state?.vote.convertedFee as number}
                                    ticker={state?.vote.exchangeCurrency as string}
                                />
                            </ActionDetailsFiatValue>
                        )
                    }
                >
                    <div className='flex items-baseline gap-1'>
                        <ActionDetailsValue>
                            {state?.vote.fee} {getActiveCoin(state?.walletNetwork)}
                        </ActionDetailsValue>
                    </div>
                </ActionDetailsRow>

                {state?.vote.unvoteDelegateName && (
                    <ActionDetailsRow label='Unvote Delegate Name'>
                        <ActionDetailsValue>{state?.vote.unvoteDelegateName}</ActionDetailsValue>
                    </ActionDetailsRow>
                )}

                {state?.vote.unvotePublicKey && wallet.isLedger() && (
                    <ActionDetailsRow label='Unvote Delegate Pubkey'>
                        <Tooltip
                            content={
                                <span className='block w-65 break-words text-left'>
                                    {state?.vote.unvotePublicKey ?? ''}
                                </span>
                            }
                            placement='bottom-end'
                        >
                            <ActionDetailsValue>
                                {trimAddress(state?.vote.unvotePublicKey ?? '', 10)}
                            </ActionDetailsValue>
                        </Tooltip>
                    </ActionDetailsRow>
                )}

                {state?.vote.unvoteDelegateAddress && !wallet.isLedger() && (
                    <ActionDetailsRow label='Unvote Delegate Address'>
                        <ActionDetailsValue>
                            {trimAddress(state.vote.unvoteDelegateAddress ?? '', 10)}
                        </ActionDetailsValue>
                    </ActionDetailsRow>
                )}

                {state?.vote.voteDelegateName && (
                    <ActionDetailsRow label='Vote Delegate Name'>
                        <ActionDetailsValue>{state?.vote.voteDelegateName}</ActionDetailsValue>
                    </ActionDetailsRow>
                )}

                {state?.vote.votePublicKey && wallet.isLedger() && (
                    <ActionDetailsRow label='Vote Delegate Pubkey'>
                        <Tooltip
                            content={
                                <span className='block w-65 break-words text-left'>
                                    {state?.vote.votePublicKey ?? ''}
                                </span>
                            }
                            placement='bottom-end'
                        >
                            <ActionDetailsValue>
                                {trimAddress(state?.vote.votePublicKey ?? '', 10)}
                            </ActionDetailsValue>
                        </Tooltip>
                    </ActionDetailsRow>
                )}

                {state?.vote.voteDelegateAddress && !wallet.isLedger() && (
                    <ActionDetailsRow label='Vote Delegate Address'>
                        <ActionDetailsValue>
                            {trimAddress(state.vote.voteDelegateAddress ?? '', 10)}
                        </ActionDetailsValue>
                    </ActionDetailsRow>
                )}

                <ActionDetailsRow label='Transaction ID'>
                    <div className='flex items-center gap-1'>
                        <ActionDetailsValue>
                            {trimAddress(state?.vote.id, 'short')}
                        </ActionDetailsValue>
                        <button
                            type='button'
                            className='block'
                            onClick={() => copy(state?.vote.id, 'Transaction ID')}
                        >
                            <Icon
                                icon='copy'
                                className='h-5 w-5 text-theme-primary-700 dark:text-theme-primary-650'
                            />
                        </button>
                    </div>
                </ActionDetailsRow>
            </ActionDetails>
        </div>
    );
};

export default VoteApprovedBody;
