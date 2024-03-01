import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TransactionApprovedBody from '@/components/approve/TransactionApprovedBody';
import constants from '@/constants';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useProfileContext } from '@/lib/context/Profile';
import formatDomain from '@/lib/utils/formatDomain';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import { Button, ExternalLink, FlexContainer, Heading, Icon, Paragraph } from '@/shared/components';
import RequestedBy from '@/shared/components/actions/RequestedBy';

const TransactionApproved = () => {
    const { state } = useLocation();
    const { profile } = useProfileContext();
    const { env } = useEnvironmentContext();
    const { session } = state;

    const onClose = async () => {
        await removeWindowInstance(state?.windowId);
    };

    useEffect(() => {
        profile.sync();
        env.persist();
    }, []);

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
                gridGap='24px'
            >
                <FlexContainer
                    flexDirection='column'
                    gridGap='24px'
                    alignItems='center'
                    width='100%'
                >
                    <FlexContainer flexDirection='column' gridGap='16px' alignItems='center'>
                        <Icon
                            icon='completed'
                            className='w-16 h-16 text-theme-primary-700 dark:text-theme-primary-650'
                        />
                        <Heading $typeset='h3' color='base' fontWeight='bold'>
                            Transaction Approved
                        </Heading>
                    </FlexContainer>
                    <TransactionApprovedBody />
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
                                ? `${constants.ARKSCAN_TESTNET_TRANSACTIONS}/${state?.transaction.id}`
                                : `${constants.ARKSCAN_MAINNET_TRANSACTIONS}/${state?.transaction.id}`
                        }
                        color='base'
                    >
                        <Paragraph $typeset='headline' fontWeight='medium' as='span'>
                            View transaction on ARKScan
                        </Paragraph>
                        <Icon icon='link-external' className='h-5 w-5' />
                    </ExternalLink>
                </FlexContainer>
            </FlexContainer>
        </FlexContainer>
    );
};

export default TransactionApproved;
