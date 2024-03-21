import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ApproveActionType } from './Approve';
import constants from '@/constants';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import { Button, ExternalLink, Heading, Icon } from '@/shared/components';
import formatDomain from '@/lib/utils/formatDomain';
import RequestedBy from '@/shared/components/actions/RequestedBy';
import { useProfileContext } from '@/lib/context/Profile';
import { WalletNetwork } from '@/lib/store/wallet';
import { ActionBody } from '@/components/approve/ActionBody';
import trimAddress from '@/lib/utils/trimAddress';
import getActiveCoin from '@/lib/utils/getActiveCoin';

const VoteApproved = () => {
    const { t } = useTranslation();
    const { state } = useLocation();
    const { profile } = useProfileContext();
    const { session } = state;
    const wallet = profile.wallets().findById(session.walletId);

    const showFiat = state.walletNetwork === WalletNetwork.MAINNET;

    const onClose = async () => {
        await removeWindowInstance(state?.windowId);
    };

    const getTitle = () => {
        switch (state?.type) {
            case ApproveActionType.VOTE:
                return t('PAGES.VOTE_APPROVED.VOTE_APPROVED');
            case ApproveActionType.UNVOTE:
                return t('PAGES.VOTE_APPROVED.UNVOTE_APPROVED');
            case ApproveActionType.SWITCH_VOTE:
                return t('PAGES.VOTE_APPROVED.SWITCH_VOTE_APPROVED');
            default:
                return '';
        }
    };

    return (
        <div className='left-0 top-0 z-10 flex w-full flex-col items-center justify-center bg-subtle-white dark:bg-light-black'>
            <RequestedBy appDomain={formatDomain(session.domain) || ''} appLogo={session.logo} />
            <div className='flex w-full flex-col items-center justify-between gap-[37px] px-4 py-6'>
                <div className='flex w-full flex-col items-center gap-6'>
                    <div className='flex flex-col items-center gap-4'>
                        <Icon
                            icon='completed'
                            className='h-16 w-16 text-theme-primary-700 dark:text-theme-primary-650'
                        />
                        <Heading level={3}>{getTitle()}</Heading>
                    </div>
                    <ActionBody 
                        isApproved
                        wallet={wallet}
                        sender={trimAddress(state?.vote.sender ?? '', 10)}
                        showFiat={showFiat}
                        fee={state?.vote.fee}
                        convertedFee={state?.vote.convertedFee as number}
                        exchangeCurrency={state?.vote.exchangeCurrency as string}
                        network={getActiveCoin(state?.walletNetwork)}
                        unvote={{
                            delegateName: state?.vote.unvoteDelegateName,
                            publicKey: state?.vote.unvotePublicKey,
                            delegateAddress: state?.vote.unvoteDelegateAddress,
                        }}
                        vote={{
                            delegateName: state?.vote.voteDelegateName,
                            publicKey: state?.vote.votePublicKey,
                            delegateAddress: state?.vote.voteDelegateAddress,
                        }}
                        transactionId={state?.vote.id}
                        maxHeight='229px'
                    />
                </div>

                <div className='flex w-full flex-col gap-5'>
                    <Button variant='primary' onClick={onClose}>
                        {t('ACTION.CLOSE')}
                    </Button>
                    <ExternalLink
                        className='flex w-full items-center justify-center gap-3 text-light-black dark:text-white'
                        href={
                            state?.isTestnet
                                ? `${constants.ARKSCAN_TESTNET_TRANSACTIONS}/${state?.vote.id}`
                                : `${constants.ARKSCAN_MAINNET_TRANSACTIONS}/${state?.vote.id}`
                        }
                        color='base'
                    >
                        <span className='typeset-headline font-medium'>
                            {t('MISC.VIEW_TRANSACTION_ON_ARKSCAN')}
                        </span>
                        <Icon icon='link-external' className='h-5 w-5' />
                    </ExternalLink>
                </div>
            </div>
        </div>
    );
};

export default VoteApproved;
