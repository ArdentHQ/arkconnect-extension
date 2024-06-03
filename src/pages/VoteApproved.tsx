import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ApproveActionType } from './Approve';
import constants from '@/constants';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import { Button, ExternalLink, Heading, Icon, Loader } from '@/shared/components';
import formatDomain from '@/lib/utils/formatDomain';
import RequestedBy from '@/shared/components/actions/RequestedBy';
import { useProfileContext } from '@/lib/context/Profile';
import { WalletNetwork } from '@/lib/store/wallet';
import { ActionBody } from '@/components/approve/ActionBody';
import trimAddress from '@/lib/utils/trimAddress';
import getActiveCoin from '@/lib/utils/getActiveCoin';
import { useConfirmedTransaction } from '@/lib/hooks/useConfirmedTransaction';

const VoteApproved = () => {
    const { t } = useTranslation();
    const { state } = useLocation();
    const { profile } = useProfileContext();
    const { session, vote } = state;

    const wallet = profile.wallets().findById(session.walletId);

    const showFiat = state.walletNetwork === WalletNetwork.MAINNET;

    const isTransactionConfirmed = useConfirmedTransaction({ wallet, transactionId: vote.id });

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
        <div className='left-0 top-0 z-10 flex w-full flex-col items-center justify-center bg-subtle-white dark:bg-light-black h-screen'>
            <div className='flex-none w-full'>
                <RequestedBy appDomain={formatDomain(session.domain) || ''} appLogo={session.logo} />
            </div>

            <div className='flex-1 overflow-y-auto custom-scroll w-full'>
                <div className='flex w-full flex-col items-center justify-between gap-[37px] px-4 py-6'>
                    <div className='flex w-full flex-col items-center gap-4'>
                        <div className='flex flex-row items-center justify-center gap-3'>
                            {isTransactionConfirmed ? (
                                <Icon
                                    icon='completed'
                                    className='h-6 w-6 text-theme-primary-700 dark:text-theme-primary-650'
                                />
                            ) : (
                                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-theme-primary-700 dark:bg-theme-primary-650'>
                                    <Icon
                                        icon='pending'
                                        className='h-4 w-4 text-theme-primary-700 dark:text-theme-primary-650'
                                    />
                                </div>
                            )}
                            <Heading level={3}>
                                {isTransactionConfirmed ? getTitle() : t('PAGES.PENDING_CONFIRMATION')}
                            </Heading>
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
                                name: state?.vote.unvoteName,
                                publicKey: state?.vote.unvotePublicKey,
                                address: state?.vote.unvoteAddress,
                            }}
                            vote={{
                                name: state?.vote.voteName,
                                publicKey: state?.vote.votePublicKey,
                                address: state?.vote.voteAddress,
                            }}
                            transactionId={isTransactionConfirmed ? vote.id : undefined}
                        />
                    </div>
                </div>
            </div>
            
            <div className='flex-none w-full'>
                <div className='flex w-full flex-col gap-5 p-4 dark:bg-subtle-black shadow-button-container dark:shadow-button-container-dark bg-white'>
                    <Button variant='primary' onClick={onClose}>
                        {t('ACTION.CLOSE')}
                    </Button>

                    {isTransactionConfirmed && (
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
                    )}

                    {!isTransactionConfirmed && (
                        <div className='flex items-center justify-center gap-2'>
                            <Loader variant='warning' />
                            <p className='typeset-heading text-theme-warning-600 dark:text-theme-warning-200'>
                                {t('PAGES.PENDING_CONFIRMATION_MESSAGE')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VoteApproved;
