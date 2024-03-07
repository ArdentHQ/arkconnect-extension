import { Contracts } from '@ardenthq/sdk-profiles';
import Amount from '../wallet/Amount';
import ActionDetails, { ActionDetailsRow } from './ActionDetails';
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
            <ActionDetailsRow label='Transaction Fee'>
                <div className='flex items-baseline gap-1'>
                    <div className='font-medium text-light-black dark:text-white'>
                        {fee} {getNetworkCurrency(wallet.network())}
                    </div>
                    {wallet.network().isLive() && (
                        <div className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                            <Amount
                                value={convertedFee}
                                ticker={wallet.exchangeCurrency() ?? 'USD'}
                            />
                        </div>
                    )}
                </div>
            </ActionDetailsRow>

            {unvote && (
                <ActionDetailsRow label='Unvote Delegate Name'>
                    <div className='font-medium text-light-black dark:text-white'>
                        {unvote.wallet?.username() ?? ''}
                    </div>
                </ActionDetailsRow>
            )}

            {unvote && !wallet.isLedger() && (
                <ActionDetailsRow label='Unvote Delegate Address'>
                    <div className='font-medium text-light-black dark:text-white'>
                        {trimAddress(unvote.wallet?.address() ?? '', 10)}
                    </div>
                </ActionDetailsRow>
            )}

            {unvote && wallet.isLedger() && (
                <ActionDetailsRow label='Unvote Delegate Pubkey'>
                    <Tooltip
                        content={
                            <span className='block w-[260px] break-words text-left'>
                                {unvote.wallet?.publicKey() ?? ''}
                            </span>
                        }
                        placement='bottom-end'
                    >
                        <div className='font-medium text-light-black dark:text-white'>
                            {trimAddress(unvote.wallet?.publicKey() ?? '', 10)}
                        </div>
                    </Tooltip>
                </ActionDetailsRow>
            )}

            {vote && (
                <ActionDetailsRow label='Vote Delegate Name'>
                    <div className='font-medium text-light-black dark:text-white'>
                        {vote.wallet?.username() ?? ''}
                    </div>
                </ActionDetailsRow>
            )}

            {vote && !wallet.isLedger() && (
                <ActionDetailsRow label='Vote Delegate Address'>
                    <div className='font-medium text-light-black dark:text-white'>
                        {trimAddress(vote.wallet?.address() ?? '', 10)}
                    </div>
                </ActionDetailsRow>
            )}

            {vote && wallet.isLedger() && (
                <ActionDetailsRow label='Vote Delegate Pubkey'>
                    <Tooltip
                        content={
                            <span className='block w-[260px] break-words text-left'>
                                {vote.wallet?.publicKey() ?? ''}
                            </span>
                        }
                        placement='bottom-end'
                    >
                        <div className='font-medium text-light-black dark:text-white'>
                            {trimAddress(vote.wallet?.publicKey() ?? '', 10)}
                        </div>
                    </Tooltip>
                </ActionDetailsRow>
            )}
        </ActionDetails>
    );
};

export default RequestedVoteBody;
