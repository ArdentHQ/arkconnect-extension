import { useLocation } from 'react-router-dom';
import { Contracts } from '@ardenthq/sdk-profiles';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import RequestedVoteBody from '@/components/approve/RequestedVoteBody';
import RequestedTransactionBody from '@/components/approve/RequestedTransactionBody';
import RequestedSignatureMessage from '@/components/approve/RequestedSignatureMessage';
import formatDomain from '@/lib/utils/formatDomain';
import trimAddress from '@/lib/utils/trimAddress';
import { ApproveActionType } from '@/pages/Approve';
import { Heading, HeadingDescription, Icon, Loader } from '@/shared/components';
import { useVoteForm } from '@/lib/hooks/useVoteForm';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';
import RequestedBy from '@/shared/components/actions/RequestedBy';
import { useSendTransferForm } from '@/lib/hooks/useSendTransferForm';
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
    const { session, amount, receiverAddress } = state;
    const { t } = useTranslation();
    const { convert } = useExchangeRate({
        exchangeTicker: wallet.exchangeCurrency(),
        ticker: wallet.currency(),
    });
    let fee = 0,
        total = 0,
        vote = null,
        unvote = null;

    if (
        actionType === ApproveActionType.VOTE ||
        actionType === ApproveActionType.UNVOTE ||
        actionType === ApproveActionType.SWITCH_VOTE
    ) {
        const {
            values: { fee: voteFee, vote: voteAction, unvote: unvoteAction },
        } = useVoteForm(wallet, state);
        fee = voteFee;
        vote = voteAction;
        unvote = unvoteAction;
    } else if (actionType === ApproveActionType.TRANSACTION) {
        const {
            values: { fee: transactionFee, total: transactionTotal },
        } = useSendTransferForm(wallet, {
            session,
            amount,
            receiverAddress,
        });
        fee = transactionFee;
        total = transactionTotal;
    }

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
                        <RequestedVoteBody
                            unvote={unvote}
                            vote={vote}
                            fee={fee}
                            convertedFee={convert(fee)}
                            wallet={wallet}
                        />
                    )}
                    {actionType === ApproveActionType.TRANSACTION && (
                        <RequestedTransactionBody
                            amount={state?.amount}
                            receiverAddress={state?.receiverAddress}
                            fee={fee}
                            total={total}
                            wallet={wallet}
                        />
                    )}
                    {actionType === ApproveActionType.SIGNATURE && (
                        <div className='h-[191px]'>
                            <RequestedSignatureMessage data={state} />
                        </div>
                    )}
                </div>

                <div
                    className={cn(
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

                    <div className='flex items-center justify-center rounded-b-2xl bg-theme-warning-50 p-2 dark:bg-theme-warning-500/10'>
                        <Loader variant='warning' />
                        <p className='typeset-body font-medium'>
                            {t('PAGES.IMPORT_WITH_LEDGER.WAITING_FOR_YOUR_SIGNATURE')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApproveWithLedger;
