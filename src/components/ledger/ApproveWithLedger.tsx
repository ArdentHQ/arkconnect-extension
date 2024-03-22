import { useLocation } from 'react-router-dom';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { ActionBody } from '@/components/approve/ActionBody';
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
import { useLedgerConnectionStatusMessage } from '@/lib/Ledger';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';

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
    const exchangeCurrency = wallet.exchangeCurrency() ?? 'USD';
    const coin = getNetworkCurrency(wallet.network());
    const withFiat = wallet.network().isLive();

    let fee = 0,
        total = 0,
        vote = null,
        unvote = null;

    const {
        values: { fee: transactionFee, total: transactionTotal, hasHigherCustomFee },
    } = useSendTransferForm(wallet, {
        session,
        amount,
        receiverAddress,
    });

    const {
        values: { fee: voteFee, vote: voteAction, unvote: unvoteAction },
    } = useVoteForm(wallet, state);

    if (
        actionType === ApproveActionType.VOTE ||
        actionType === ApproveActionType.UNVOTE ||
        actionType === ApproveActionType.SWITCH_VOTE
    ) {
        fee = voteFee;
        vote = voteAction;
        unvote = unvoteAction;
    } else if (actionType === ApproveActionType.TRANSACTION) {
        fee = transactionFee;
        total = transactionTotal;
    }

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
        <div className='flex max-h-screen min-h-screen flex-col overflow-auto bg-subtle-white dark:bg-light-black'>
            <RequestedBy appDomain={formatDomain(appName) || ''} appLogo={appLogo} />
            <div className='flex flex-1 flex-col overflow-auto px-4 pt-4'>
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
                <div className='mt-6 flex flex-1 flex-col overflow-auto'>
                    {votingActionTypes.includes(actionType) && (
                        <ActionBody
                            isApproved={false}
                            showFiat={wallet.network().isLive()}
                            wallet={wallet}
                            fee={fee}
                            convertedFee={convert(fee)}
                            exchangeCurrency={wallet.exchangeCurrency() ?? 'USD'}
                            network={getNetworkCurrency(wallet.network())}
                            unvote={{
                                delegateName: unvote?.wallet?.username(),
                                publicKey: unvote?.wallet?.publicKey(),
                                delegateAddress: unvote?.wallet?.address(),
                            }}
                            vote={{
                                delegateName: vote?.wallet?.username(),
                                publicKey: vote?.wallet?.publicKey(),
                                delegateAddress: vote?.wallet?.address(),
                            }}
                            maxHeight='165px'
                            hasHigherCustomFee={hasHigherCustomFee}
                        />
                    )}
                    {actionType === ApproveActionType.TRANSACTION && (
                        <ActionBody
                            isApproved={false}
                            showFiat={withFiat}
                            amount={amount}
                            amountTicker={coin}
                            convertedAmount={convert(amount)}
                            exchangeCurrency={exchangeCurrency}
                            network={getNetworkCurrency(wallet.network())}
                            fee={fee}
                            convertedFee={convert(fee)}
                            receiver={trimAddress(receiverAddress as string, 10)}
                            totalAmount={total}
                            convertedTotalAmount={convert(total)}
                        />
                    )}
                    {actionType === ApproveActionType.SIGNATURE && (
                        <div className='h-[191px]'>
                            <RequestedSignatureMessage data={state} />
                        </div>
                    )}
                </div>

                <div className={twMerge('mb-6 ', getTopMarginClass())}>
                    <div className='overflow-hidden rounded-2xl border border-solid border-theme-warning-400'>
                        {!!address && (
                            <div className='flex justify-center bg-white p-[14px] dark:bg-light-black'>
                                <p className='typeset-headline text-light-black dark:text-white'>
                                    {trimAddress(address, 'long')}
                                </p>
                            </div>
                        )}

                        <div className='flex items-center justify-center space-x-2 rounded-b-2xl bg-theme-warning-50 px-4 py-2 dark:bg-theme-warning-500/10'>
                            <Loader variant='warning' className=' flex-shrink-0' />

                            <span className='typeset-body font-medium text-theme-warning-500'>
                                {statusMessage}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApproveWithLedger;
