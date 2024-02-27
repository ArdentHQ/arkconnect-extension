import VoteApprovedBody from '@/components/approve/VoteApprovedBody';
import constants from '@/constants';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import { FlexContainer, Icon, Heading, Button, ExternalLink, Paragraph } from '@/shared/components';
import { useLocation } from 'react-router-dom';
import { ApproveActionType } from './Approve';
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
        <FlexContainer
            width='100%'
            position='fixed'
            top='0'
            left='0'
            zIndex='10'
            backgroundColor='primaryBackground'
            $flexVariant='columnCenter'
        >
            <RequestedBy appDomain={formatDomain(session.domain) || ''} appLogo={session.logo} />
            <FlexContainer
                flexDirection='column'
                alignItems='center'
                justifyContent='space-between'
                width='100%'
                px='16'
                pt='24'
                gridGap='37px'
            >
                <FlexContainer
                    flexDirection='column'
                    gridGap='24px'
                    alignItems='center'
                    width='100%'
                >
                    <FlexContainer flexDirection='column' gridGap='16px' alignItems='center'>
                        <Icon icon='completed' width='64px' height='64px' color='primary' />
                        <Heading $typeset='h3' color='base' fontWeight='bold'>
                            {getTitle()}
                        </Heading>
                    </FlexContainer>
                    <VoteApprovedBody wallet={wallet} />
                </FlexContainer>
                <FlexContainer flexDirection='column' gridGap='20px' width='100%'>
                    <Button variant='primary' onClick={onClose}>
                        Close
                    </Button>
                    <ExternalLink
                        alignItems='center'
                        justifyContent='center'
                        display='flex'
                        width='100%'
                        gridGap='12px'
                        href={
                            state?.isTestnet
                                ? `${constants.ARKSCAN_TESTNET_TRANSACTIONS}/${state?.vote.id}`
                                : `${constants.ARKSCAN_MAINNET_TRANSACTIONS}/${state?.vote.id}`
                        }
                        color='base'
                    >
                        <Paragraph $typeset='headline' fontWeight='medium' as='span'>
                            View transaction on ARKScan
                        </Paragraph>
                        <Icon icon='link-external' width='20px' height='20px' />
                    </ExternalLink>
                </FlexContainer>
            </FlexContainer>
        </FlexContainer>
    );
};

export default VoteApproved;
