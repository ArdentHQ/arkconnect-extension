import { useLocation } from 'react-router-dom';
import { ApproveActionType } from './Approve';
import VoteApprovedBody from '@/components/approve/VoteApprovedBody';
import constants from '@/constants';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import { Button, ExternalLink, Heading, Icon } from '@/shared/components';
import formatDomain from '@/lib/utils/formatDomain';
import RequestedBy from '@/shared/components/actions/RequestedBy';
import { useProfileContext } from '@/lib/context/Profile';

const VoteApproved = () => {
    const { state } = useLocation();
    const { profile } = useProfileContext();
    const { session } = state;
    const wallet = profile.wallets().findById(session.walletId);

    const onClose = async () => {
        await removeWindowInstance(state?.windowId);
    };

    const getTitle = () => {
        switch (state?.type) {
            case ApproveActionType.VOTE:
                return 'Vote Approved';
            case ApproveActionType.UNVOTE:
                return 'Unvote Approved';
            case ApproveActionType.SWITCH_VOTE:
                return 'Switch Vote Approved';
            default:
                return '';
        }
    };

    return (
        <div className='fixed left-0 top-0 z-10 flex w-full  items-center justify-center bg-subtle-white dark:bg-light-black'>
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
                    <VoteApprovedBody wallet={wallet} />
                </div>

                <div className='flex w-full flex-col gap-5'>
                    <Button variant='primary' onClick={onClose}>
                        Close
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
                        <p className='typeset-headline font-medium'>View transaction on ARKScan</p>
                        <Icon icon='link-external' className='h-5 w-5' />
                    </ExternalLink>
                </div>
            </div>
        </div>
    );
};

export default VoteApproved;
