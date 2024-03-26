import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { useLocation } from 'react-router-dom';
import {
    SignatureLedgerApprovalBody,
    TransactionLedgerApprovalBody,
    VoteLedgerApprovalBody,
} from './ApproveWithLedger.blocks';
import formatDomain from '@/lib/utils/formatDomain';
import trimAddress from '@/lib/utils/trimAddress';
import { ApproveActionType } from '@/pages/Approve';
import { Heading, HeadingDescription, Icon, Loader } from '@/shared/components';
import RequestedBy from '@/shared/components/actions/RequestedBy';
import { NavButton } from '@/shared/components/nav/NavButton';

type Props = {
    actionType: ApproveActionType;
    appName: string;
    appLogo: string;
    address?: string;
    closeLedgerScreen: () => void;
    wallet: Contracts.IReadWriteWallet;
};

const ApproveWithLedger = ({
    actionType,
    appName,
    appLogo,
    address,
    closeLedgerScreen,
    wallet,
}: Props) => {
    const location = useLocation();
    const { state } = location;

    const { t } = useTranslation();

    const votingActionTypes = [
        ApproveActionType.VOTE,
        ApproveActionType.UNVOTE,
        ApproveActionType.SWITCH_VOTE,
    ];

    const getActionMessage = () => {
        switch (actionType) {
            case ApproveActionType.SIGNATURE:
                return t('COMMON.MESSAGE');
            case ApproveActionType.TRANSACTION:
                return t('COMMON.TRANSACTION');
            case ApproveActionType.VOTE:
                return t('COMMON.VOTE');
            case ApproveActionType.UNVOTE:
                return t('COMMON.UNVOTE');
            case ApproveActionType.SWITCH_VOTE:
                return t('COMMON.SWITCH_VOTE');
            default:
                return '';
        }
    };

    const getTopMarginClass = () => {
        switch (actionType) {
            case ApproveActionType.VOTE:
            case ApproveActionType.UNVOTE:
                return 'mt-20';
            case ApproveActionType.SWITCH_VOTE:
                return 'mt-11';
            default:
                return 'mt-6';
        }
    };

    return (
        <div className=' min-h-screen bg-subtle-white dark:bg-light-black'>
            <RequestedBy appDomain={formatDomain(appName) || ''} appLogo={appLogo} />
            <div className='px-4 pt-4'>
                <div className='flex items-center justify-between gap-3 bg-subtle-white dark:bg-light-black'>
                    <NavButton onClick={closeLedgerScreen}>
                        <Icon
                            icon='arrow-left'
                            className='h-4.5 w-4.5 text-theme-primary-700 dark:text-theme-primary-650'
                        />
                    </NavButton>
                </div>
                <Heading className='mb-2 mt-4' level={3}>
                    {t('PAGES.IMPORT_WITH_LEDGER.CONNECT_LEDGER_AND_SIGN_THE_REQUEST', {
                        action: getActionMessage(),
                    })}
                </Heading>
                <HeadingDescription>
                    {t('PAGES.IMPORT_WITH_LEDGER.CONNECT_YOUR_LEDGER_DEVICE_DISCLAIMER')}
                </HeadingDescription>
                <div className='mt-6'>
                    {votingActionTypes.includes(actionType) && (
                        <VoteLedgerApprovalBody wallet={wallet} state={state} />
                    )}
                    {actionType === ApproveActionType.TRANSACTION && (
                        <TransactionLedgerApprovalBody wallet={wallet} state={state} />
                    )}
                    {actionType === ApproveActionType.SIGNATURE && <SignatureLedgerApprovalBody />}
                </div>

                <div
                    className={twMerge(
                        'mb-6 overflow-hidden rounded-2xl border border-solid border-theme-warning-400',
                        getTopMarginClass(),
                    )}
                >
                    {!!address && (
                        <div className='flex justify-center bg-white p-[14px] dark:bg-light-black'>
                            <p className='typeset-headline text-light-black dark:text-white'>
                                {trimAddress(address, 'long')}
                            </p>
                        </div>
                    )}

                    <div className='flex items-center justify-center rounded-b-2xl bg-theme-warning-50 p-2 dark:bg-theme-warning-500/10 gap-2'>
                        <Loader variant='warning' />
                        <p className='typeset-body font-medium text-theme-warning-500'>
                            {t('PAGES.IMPORT_WITH_LEDGER.WAITING_FOR_YOUR_SIGNATURE')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApproveWithLedger;
