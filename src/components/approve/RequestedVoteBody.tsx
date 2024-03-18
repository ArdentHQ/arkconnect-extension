import { Contracts } from '@ardenthq/sdk-profiles';
import Amount from '../wallet/Amount';
import ActionDetails, {
    ActionDetailsFiatValue,
    ActionDetailsRow,
    ActionDetailsValue,
} from './ActionDetails';
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
            <ActionDetailsRow
                label='Transaction Fee'
                below={
                    wallet.network().isLive() && (
                        <ActionDetailsFiatValue>
                            <Amount
                                value={convertedFee}
                                ticker={wallet.exchangeCurrency() ?? 'USD'}
                                underlineOnHover={true}
                                tooltipPlacement='bottom-end'
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
                    <Address
                        address={unvote.wallet?.address() ?? ''}
                        tooltipPlacement='bottom-end'
                        length={10}
                        classNames='leading-5 font-medium text-light-black dark:text-white'
                    />
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
                            <span className="underline-offset-2 hover:underline">
                            {trimAddress(unvote.wallet?.publicKey() ?? '', 10)}</span>
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
                    <Address
                        address={vote.wallet?.address() ?? ''}
                        tooltipPlacement='bottom-end'
                        length={10}
                        classNames='leading-5 font-medium text-light-black dark:text-white'
                    />
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
                            <span className="underline-offset-2 hover:underline">
                            {trimAddress(vote.wallet?.publicKey() ?? '', 10)}
                            </span>
                        </ActionDetailsValue>
                    </Tooltip>
                </ActionDetailsRow>
            )}
        </ActionDetails>
    );
};

export default RequestedVoteBody;
