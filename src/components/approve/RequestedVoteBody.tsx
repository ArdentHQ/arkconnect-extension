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
import { Address } from '@/components/wallet/address/Address.blocks';

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
                <ActionDetailsRow label={t('COMMON.UNVOTE_DELEGATE_NAME')}>
                    <ActionDetailsValue>{unvote.wallet?.username() ?? ''}</ActionDetailsValue>
                </ActionDetailsRow>
            )}

            {unvote && !wallet.isLedger() && (
                <ActionDetailsRow label={t('COMMON.UNVOTE_DELEGATE_ADDRESS')}>
                    <Address
                        address={unvote.wallet?.address() ?? ''}
                        tooltipPlacement='bottom-end'
                        length={10}
                        classNames='leading-5 font-medium text-light-black dark:text-white'
                    />
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
                            <span className='underline-offset-2 hover:underline'>
                                {trimAddress(unvote.wallet?.publicKey() ?? '', 10)}
                            </span>
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
                    <Address
                        address={vote.wallet?.address() ?? ''}
                        tooltipPlacement='bottom-end'
                        length={10}
                        classNames='leading-5 font-medium text-light-black dark:text-white'
                    />
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
                            <span className='underline-offset-2 hover:underline'>
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
