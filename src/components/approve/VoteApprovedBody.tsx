import { useLocation } from 'react-router-dom';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
import Amount from '../wallet/Amount';
import ActionDetails, {
    ActionDetailsFiatValue,
    ActionDetailsRow,
    ActionDetailsValue,
} from './ActionDetails';
import useClipboard from '@/lib/hooks/useClipboard';
import trimAddress from '@/lib/utils/trimAddress';
import { Icon, Tooltip } from '@/shared/components';
import getActiveCoin from '@/lib/utils/getActiveCoin';
import { WalletNetwork } from '@/lib/store/wallet';

const VoteApprovedBody = ({ wallet }: { wallet: Contracts.IReadWriteWallet }) => {
    const { state } = useLocation();
    const { copy } = useClipboard();
    const { t } = useTranslation();
    const showFiat = state.walletNetwork === WalletNetwork.MAINNET;

    return (
        <div className='w-full'>
            <ActionDetails maxHeight='229px'>
                <ActionDetailsRow label={t('COMMON.SENDER')}>
                    <ActionDetailsValue>
                        {trimAddress(state?.vote.sender ?? '', 10)}
                    </ActionDetailsValue>
                </ActionDetailsRow>

                <ActionDetailsRow
                    label={t('COMMON.TRANSACTION_FEE')}
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
                    <ActionDetailsRow label={t('COMMON.UNVOTE_DELEGATE_NAME')}>
                        <ActionDetailsValue>{state?.vote.unvoteDelegateName}</ActionDetailsValue>
                    </ActionDetailsRow>
                )}

                {state?.vote.unvotePublicKey && wallet.isLedger() && (
                    <ActionDetailsRow label={t('COMMON.UNVOTE_DELEGATE_PUBKEY')}>
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
                    <ActionDetailsRow label={t('COMMON.UNVOTE_DELEGATE_ADDRESS')}>
                        <ActionDetailsValue>
                            {trimAddress(state.vote.unvoteDelegateAddress ?? '', 10)}
                        </ActionDetailsValue>
                    </ActionDetailsRow>
                )}

                {state?.vote.voteDelegateName && (
                    <ActionDetailsRow label={t('COMMON.VOTE_DELEGATE_NAME')}>
                        <ActionDetailsValue>{state?.vote.voteDelegateName}</ActionDetailsValue>
                    </ActionDetailsRow>
                )}

                {state?.vote.votePublicKey && wallet.isLedger() && (
                    <ActionDetailsRow label={t('COMMON.VOTE_DELEGATE_PUBKEY')}>
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
                    <ActionDetailsRow label={t('COMMON.VOTE_DELEGATE_ADDRESS')}>
                        <ActionDetailsValue>
                            {trimAddress(state.vote.voteDelegateAddress ?? '', 10)}
                        </ActionDetailsValue>
                    </ActionDetailsRow>
                )}

                <ActionDetailsRow label={t('COMMON.TRANSACTION_ID')}>
                    <div className='flex items-center gap-1'>
                        <ActionDetailsValue>
                            {trimAddress(state?.vote.id, 'short')}
                        </ActionDetailsValue>
                        <button
                            type='button'
                            className='block'
                            onClick={() => copy(state?.vote.id, t('COMMON.TRANSACTION_ID'))}
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
