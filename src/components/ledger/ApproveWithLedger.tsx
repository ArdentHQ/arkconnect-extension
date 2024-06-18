import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
    SignatureLedgerApprovalBody,
    TransactionLedgerApprovalBody,
    VoteLedgerApprovalBody,
} from './ApproveWithLedger.blocks';
import formatDomain from '@/lib/utils/formatDomain';
import trimAddress from '@/lib/utils/trimAddress';
import { ApproveActionType } from '@/pages/Approve';
import { ArrowButton, Heading, HeadingDescription, Loader } from '@/shared/components';
import RequestedBy from '@/shared/components/actions/RequestedBy';
import { useLedgerConnectionStatusMessage } from '@/lib/Ledger';

type Props = {
    actionType: ApproveActionType;
    appName: string;
    appLogo: string;
    address?: string;
    wallet: Contracts.IReadWriteWallet;
    handleBackButtonClick: () => void;
};

const ApproveWithLedger = ({
    actionType,
    appName,
    appLogo,
    address,
    wallet,
    handleBackButtonClick,
}: Props) => {
    const location = useLocation();
    const { state } = location;

    const { t } = useTranslation();

    const votingActionTypes = [
        ApproveActionType.VOTE,
        ApproveActionType.UNVOTE,
        ApproveActionType.SWITCH_VOTE,
    ];

    const statusMessage = useLedgerConnectionStatusMessage();

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
                return t('COMMON.VOTE_SWAP');
            default:
                return '';
        }
    };

    return (
        <div className='flex max-h-screen min-h-screen flex-col overflow-auto bg-subtle-white dark:bg-light-black'>
            <RequestedBy appDomain={formatDomain(appName) || ''} appLogo={appLogo} />
            <div className='custom-scroll flex flex-1 flex-col overflow-auto px-4 py-4'>
                <div className='flex items-center justify-between gap-3 bg-subtle-white dark:bg-light-black'>
                    <ArrowButton onClick={handleBackButtonClick} />
                </div>
                <Heading className='mb-2 mt-4' level={3}>
                    {t('PAGES.IMPORT_WITH_LEDGER.CONNECT_LEDGER_AND_SIGN_THE_REQUEST', {
                        action: getActionMessage(),
                    })}
                </Heading>
                <HeadingDescription>
                    {t('PAGES.IMPORT_WITH_LEDGER.CONNECT_YOUR_LEDGER_DEVICE_DISCLAIMER')}
                </HeadingDescription>
                <div className='mt-6 flex flex-1 flex-col'>
                    {votingActionTypes.includes(actionType) && (
                        <VoteLedgerApprovalBody wallet={wallet} state={state} />
                    )}
                    {actionType === ApproveActionType.TRANSACTION && (
                        <TransactionLedgerApprovalBody wallet={wallet} state={state} />
                    )}
                    {actionType === ApproveActionType.SIGNATURE && <SignatureLedgerApprovalBody />}
                </div>
            </div>

            <div className='flex-none bg-white dark:bg-subtle-black'>
                <div className='m-4 overflow-hidden rounded-2xl border border-solid border-theme-warning-400'>
                    {!!address && (
                        <div className='flex justify-center bg-white p-[14px] dark:bg-light-black'>
                            <p className='typeset-headline text-light-black dark:text-white'>
                                {trimAddress(address, 'long')}
                            </p>
                        </div>
                    )}

                    <div className='flex items-center justify-center space-x-2 rounded-b-2xl bg-theme-warning-50 px-4 py-2 dark:bg-theme-warning-500/10'>
                        <Loader variant='warning' className='flex-shrink-0' />

                        <span className='typeset-body font-medium text-theme-warning-500'>
                            {statusMessage}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApproveWithLedger;
