import { useLocation } from 'react-router-dom';
import { Contracts } from '@ardenthq/sdk-profiles';
import Amount from '../wallet/Amount';
import ActionDetails, { ActionDetailsRow } from './ActionDetails';
import useClipboard from '@/lib/hooks/useClipboard';
import trimAddress from '@/lib/utils/trimAddress';
import { Icon, Tooltip } from '@/shared/components';
import getActiveCoin from '@/lib/utils/getActiveCoin';
import { WalletNetwork } from '@/lib/store/wallet';

const VoteApprovedBody = ({ wallet }: { wallet: Contracts.IReadWriteWallet }) => {
    const { state } = useLocation();
    const { copy } = useClipboard();

    return (
        <div className='w-full'>
            <ActionDetails maxHeight='229px'>
                <ActionDetailsRow label='Sender'>
                    <div className='font-medium text-light-black dark:text-white'>
                        {trimAddress(state?.vote.sender ?? '', 10)}
                    </div>
                </ActionDetailsRow>

                <ActionDetailsRow label='Transaction Fee'>
                    <div className='flex items-baseline gap-1'>
                        <div className='font-medium text-light-black dark:text-white'>
                            {state?.vote.fee} {getActiveCoin(state?.walletNetwork)}
                        </div>
                        {state.walletNetwork === WalletNetwork.MAINNET && (
                            <div className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                                <Amount
                                    value={state?.vote.convertedFee as number}
                                    ticker={state?.vote.exchangeCurrency as string}
                                />
                            </div>
                        )}
                    </div>
                </ActionDetailsRow>

                {state?.vote.unvoteDelegateName && (
                    <ActionDetailsRow label='Unvote Delegate Name'>
                        <div className='font-medium text-light-black dark:text-white'>
                            {state?.vote.unvoteDelegateName}
                        </div>
                    </ActionDetailsRow>
                )}

                {state?.vote.unvotePublicKey && wallet.isLedger() && (
                    <ActionDetailsRow label='Unvote Delegate Pubkey'>
                        <Tooltip
                            content={
                                <span className='block w-[260px] break-words text-left'>
                                    {state?.vote.unvotePublicKey ?? ''}
                                </span>
                            }
                            placement='bottom-end'
                        >
                            <div className='font-medium text-light-black dark:text-white'>
                                {trimAddress(state?.vote.unvotePublicKey ?? '', 10)}
                            </div>
                        </Tooltip>
                    </ActionDetailsRow>
                )}

                {state?.vote.unvoteDelegateAddress && !wallet.isLedger() && (
                    <ActionDetailsRow label='Unvote Delegate Address'>
                        <div className='font-medium text-light-black dark:text-white'>
                            {trimAddress(state.vote.unvoteDelegateAddress ?? '', 10)}
                        </div>
                    </ActionDetailsRow>
                )}

                {state?.vote.voteDelegateName && (
                    <ActionDetailsRow label='Vote Delegate Name'>
                        <div className='font-medium text-light-black dark:text-white'>
                            {state?.vote.voteDelegateName}
                        </div>
                    </ActionDetailsRow>
                )}

                {state?.vote.votePublicKey && wallet.isLedger() && (
                    <ActionDetailsRow label='Vote Delegate Pubkey'>
                        <Tooltip
                            content={
                                <span className='block w-[260px] break-words text-left'>
                                    {state?.vote.votePublicKey ?? ''}
                                </span>
                            }
                            placement='bottom-end'
                        >
                            <div className='font-medium text-light-black dark:text-white'>
                                {trimAddress(state?.vote.votePublicKey ?? '', 10)}
                            </div>
                        </Tooltip>
                    </ActionDetailsRow>
                )}

                {state?.vote.voteDelegateAddress && !wallet.isLedger() && (
                    <ActionDetailsRow label='Vote Delegate Address'>
                        <div className='font-medium text-light-black dark:text-white'>
                            {trimAddress(state.vote.voteDelegateAddress ?? '', 10)}
                        </div>
                    </ActionDetailsRow>
                )}

                <ActionDetailsRow label='Transaction ID'>
                    <div className='flex items-center gap-1'>
                        <div className='font-medium text-light-black dark:text-white'>
                            {trimAddress(state?.vote.id, 'short')}
                        </div>
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
