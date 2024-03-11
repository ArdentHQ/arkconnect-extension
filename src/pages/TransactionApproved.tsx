import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TransactionApprovedBody from '@/components/approve/TransactionApprovedBody';
import constants from '@/constants';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useProfileContext } from '@/lib/context/Profile';
import formatDomain from '@/lib/utils/formatDomain';
import removeWindowInstance from '@/lib/utils/removeWindowInstance';
import { Button, ExternalLink, HeadingTODO, Icon } from '@/shared/components';
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
        <div className=' fixed left-0 top-0 z-10 flex w-full flex-col items-center justify-center bg-subtle-white dark:bg-light-black'>
            <RequestedBy appDomain={formatDomain(session.domain) || ''} appLogo={session.logo} />

            <div className=' flex w-full flex-col items-center justify-between gap-6 px-4 pt-6'>
                <div className='flex w-full flex-col items-center gap-6'>
                    <div className='flex flex-col items-center gap-4'>
                        <Icon
                            icon='completed'
                            className='h-16 w-16 text-theme-primary-700 dark:text-theme-primary-650'
                        />

                        <HeadingTODO level={3}>Transaction Approved</HeadingTODO>
                    </div>

                    <TransactionApprovedBody />
                </div>

                <div className='flex w-full flex-col gap-5'>
                    <Button variant='primary' onClick={onClose}>
                        Close
                    </Button>

                    <ExternalLink
                        className='flex w-full items-center justify-center gap-3 text-light-black dark:text-white'
                        href={
                            state?.isTestnet
                                ? `${constants.ARKSCAN_TESTNET_TRANSACTIONS}/${state?.transaction.id}`
                                : `${constants.ARKSCAN_MAINNET_TRANSACTIONS}/${state?.transaction.id}`
                        }
                    >
                        <span className='font-medium'>View transaction on ARKScan</span>

                        <Icon icon='link-external' className='h-5 w-5' />
                    </ExternalLink>
                </div>
            </div>
        </div>
    );
};

export default TransactionApproved;
