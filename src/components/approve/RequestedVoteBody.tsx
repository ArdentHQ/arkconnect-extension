import { Contracts } from '@ardenthq/sdk-profiles';
import Amount from '../wallet/Amount';
import ActionDetails, { ActionDetailsRow } from './ActionDetails';
import { Tooltip } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';
import {Address} from "@/components/wallet/address/Address.blocks";

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
                                underlineOnHover={true}
                                tooltipPlacement='bottom-end'
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
                    <Address address={unvote.wallet?.address() ?? ''} tooltipPlacement='bottom-end' length={10} classNames="text-base leading-5 font-medium text-light-black dark:text-white"/>
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
                        <div className='font-medium text-light-black dark:text-white underline-offset-2 hover:underline'>
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
                    <Address address={vote.wallet?.address() ?? ''} tooltipPlacement='bottom-end' length={10} classNames="text-base leading-5 font-medium text-light-black dark:text-white"/>
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
                        <div className='font-medium text-light-black dark:text-white underline-offset-2 hover:underline'>
                            {trimAddress(vote.wallet?.publicKey() ?? '', 10)}
                        </div>
                    </Tooltip>
                </ActionDetailsRow>
            )}
        </ActionDetails>
    );
};

export default RequestedVoteBody;
