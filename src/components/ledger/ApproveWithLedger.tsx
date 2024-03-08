import { useLocation } from 'react-router-dom';
import { Contracts } from '@ardenthq/sdk-profiles';
import RequestedVoteBody from '../approve/RequestedVoteBody';
import RequestedTransactionBody from '../approve/RequestedTransactionBody';
import RequestedSignatureMessage from '../approve/RequestedSignatureMessage';
import useThemeMode from '@/lib/hooks/useThemeMode';
import formatDomain from '@/lib/utils/formatDomain';
import trimAddress from '@/lib/utils/trimAddress';
import { ApproveActionType } from '@/pages/Approve';
import {
    Container,
    ContainerWithHover,
    Heading,
    Icon,
    Loader,
    Paragraph,
} from '@/shared/components';
import { useVoteForm } from '@/lib/hooks/useVoteForm';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';
import RequestedBy from '@/shared/components/actions/RequestedBy';
import { useSendTransferForm } from '@/lib/hooks/useSendTransferForm';

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
    const { getThemeColor } = useThemeMode();
    const location = useLocation();
    const { state } = location;
    const { session, amount, receiverAddress } = state;
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
                return 'Message';
            case ApproveActionType.TRANSACTION:
                return 'Transaction';
            case ApproveActionType.VOTE:
                return 'Vote';
            case ApproveActionType.UNVOTE:
                return 'Unvote';
            case ApproveActionType.SWITCH_VOTE:
                return 'Switch Vote';
            default:
                return '';
        }
    };

    const getBottomMargin = () => {
        switch (actionType) {
            case ApproveActionType.VOTE:
            case ApproveActionType.UNVOTE:
                return '80';
            case ApproveActionType.SWITCH_VOTE:
                return '44';
            default:
                return '24';
        }
    };

    return (
        <Container backgroundColor={getThemeColor('subtleWhite', 'lightBlack')} minHeight='100vh'>
            <RequestedBy appDomain={formatDomain(appName) || ''} appLogo={appLogo} />
            <Container pt='16' px='16'>
                <div className='flex items-center justify-between gap-3 bg-subtle-white dark:bg-light-black'>
                    <ContainerWithHover borderRadius='50' padding='7' onClick={closeLedgerScreen}>
                        <Icon
                            icon='arrow-left'
                            className='h-4.5 w-4.5 text-theme-primary-700 dark:text-theme-primary-650'
                        />
                    </ContainerWithHover>
                </div>
                <Heading $typeset='h3' fontWeight='bold' color='base' mb='8' mt='16'>
                    Connect Ledger and Sign The {getActionMessage()} Request
                </Heading>
                <Paragraph $typeset='headline' fontWeight='regular' color='gray'>
                    Connect your Ledger device, launch the ARK app, and carefully review the request
                    on your device before confirming your approval.
                </Paragraph>
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
                        <Container height='191px'>
                            <RequestedSignatureMessage data={state} />
                        </Container>
                    )}
                </div>

                <Container
                    border='1px solid'
                    borderColor='warning400'
                    borderRadius='16'
                    mt={getBottomMargin()}
                    mb='24'
                    overflow='hidden'
                >
                    {!!address && (
                        <div className='flex justify-center bg-white p-[14px] dark:bg-light-black'>
                            <Paragraph $typeset='headline' fontWeight='regular' color='base'>
                                {trimAddress(address, 'long')}
                            </Paragraph>
                        </div>
                    )}

                    <div className='flex items-center justify-center rounded-b-2xl bg-theme-warning-50 p-2 dark:bg-theme-warning-500/10'>
                        <Loader variant='warning' />
                        <Paragraph $typeset='body' fontWeight='medium'>
                            Waiting for your signature
                        </Paragraph>
                    </div>
                </Container>
            </Container>
        </Container>
    );
};

export default ApproveWithLedger;
