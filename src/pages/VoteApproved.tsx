import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { runtime } from 'webextension-polyfill';
import { BigNumber } from '../lib/helpers';
import { ApproveActionType } from './Approve';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import { Button, ExternalLink, Heading, Icon, Loader } from '@/shared/components';
import formatDomain from '@/lib/utils/formatDomain';
import { useProfileContext } from '@/lib/context/Profile';
import { WalletNetwork } from '@/lib/store/wallet';
import { ActionBody } from '@/components/approve/ActionBody';
import getActiveCoin from '@/lib/utils/getActiveCoin';
import { useConfirmedTransaction } from '@/lib/hooks/useConfirmedTransaction';
import { ApproveLayout } from '@/components/approve/ApproveLayout';
import { Footer } from '@/shared/components/layout/Footer';

const VoteApprovedFooter = ({
    onClose,
    isTransactionConfirmed,
    explorerLink,
}: {
    onClose: () => void;
    isTransactionConfirmed: boolean;
    explorerLink: string;
}) => {
    const { t } = useTranslation();

    return (
        <Footer className='flex w-full flex-col gap-5'>
            <Button variant='primary' onClick={onClose}>
                {t('ACTION.CLOSE')}
            </Button>

            {isTransactionConfirmed && (
                <ExternalLink
                    className='text-light-black flex w-full items-center justify-center gap-3 dark:text-white'
                    href={explorerLink}
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
        </Footer>
    );
};

const VoteApproved = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { state } = useLocation();
    const { profile } = useProfileContext();
    const { session, vote } = state;

    const wallet = profile.wallets().findById(session.walletId);
    const explorerLink = wallet.link().transaction(vote.id);

    const showFiat = state.walletNetwork === WalletNetwork.MAINNET;

    const isTransactionConfirmed = useConfirmedTransaction({ wallet, transactionId: vote.id });

    const onClose = async () => {
        if (state?.windowId) {
            await removeWindowInstance(state?.windowId);
        }

        navigate('/');
    };
    useEffect(() => {
        runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
        profile.settings().forget('LAST_VISITED_PAGE');
    }, []);

    const getTitle = () => {
        switch (state?.type) {
            case ApproveActionType.VOTE:
                return t('PAGES.VOTE_APPROVED.VOTE_APPROVED');
            case ApproveActionType.UNVOTE:
                return t('PAGES.VOTE_APPROVED.UNVOTE_APPROVED');
            case ApproveActionType.SWITCH_VOTE:
                return t('PAGES.VOTE_APPROVED.VOTE_SWAP_APPROVED');
            default:
                return '';
        }
    };

    return (
        <ApproveLayout
            containerClassName='left-0 top-0 z-10 w-full items-center justify-center bg-subtle-white dark:bg-light-black'
            appDomain={formatDomain(session.domain) || ''}
            appLogo={session.logo}
            footer={
                <VoteApprovedFooter
                    onClose={onClose}
                    isTransactionConfirmed={isTransactionConfirmed}
                    explorerLink={explorerLink}
                />
            }
        >
            <div className='flex w-full flex-col items-center justify-between gap-[37px] px-4 py-6'>
                <div className='flex w-full flex-col items-center gap-4'>
                    <div className='flex flex-row items-center justify-center gap-3'>
                        {isTransactionConfirmed ? (
                            <Icon
                                icon='completed'
                                className='text-theme-primary-700 dark:text-theme-primary-650 h-6 w-6'
                            />
                        ) : (
                            <div className='bg-theme-primary-700 dark:bg-theme-primary-650 flex h-6 w-6 items-center justify-center rounded-full'>
                                <Icon
                                    icon='pending'
                                    className='text-theme-primary-700 dark:text-theme-primary-650 h-4 w-4'
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
                        sender={state?.vote.sender}
                        showFiat={showFiat}
                        fee={state?.vote.fee}
                        convertedFee={state?.vote.convertedFee as BigNumber}
                        exchangeCurrency={state?.vote.exchangeCurrency as string}
                        network={getActiveCoin(state?.walletNetwork)}
                        amountTicker={getActiveCoin(state?.walletNetwork)}
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
        </ApproveLayout>
    );
};

export default VoteApproved;
