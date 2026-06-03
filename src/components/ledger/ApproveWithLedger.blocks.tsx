import { useLocation } from 'react-router-dom';
import RequestedSignatureMessage from '../approve/RequestedSignatureMessage';
import { ActionBody } from '../approve/ActionBody';
import { Contracts } from '@/lib/profiles';
import trimAddress from '@/lib/utils/trimAddress';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';
import { useSendTransferForm } from '@/lib/hooks/useSendTransferForm';
import { useVoteForm } from '@/lib/hooks/useVoteForm';
import * as SessionStore from '@/lib/store/session';
import { calculateGasFee } from '@/lib/hooks/useNetworkFees';
import { BigNumber } from '@/lib/helpers';

type VoteDelegateProperties = {
    address: string;
    amount: number;
};
interface Props {
    wallet: Contracts.IReadWriteWallet;
    state: {
        amount: BigNumber;
        receiverAddress: string;
        domain: string;
        session: SessionStore.Session;
        vote: VoteDelegateProperties;
        unvote: VoteDelegateProperties;
        tabId: number;
        gasPrice?: string;
        gasLimit?: string;
    };
}

export const VoteLedgerApprovalBody = ({ wallet, state }: Props) => {
    const {
        values: { gasPrice, gasLimit, vote, unvote, hasLowerCustomFee, hasHigherCustomFee },
    } = useVoteForm(wallet, state);

    const fee = calculateGasFee(gasPrice, gasLimit);

    return (
        <ActionBody
            isApproved={false}
            wallet={wallet}
            fee={fee}
            network={getNetworkCurrency(wallet.network())}
            unvote={{
                name: unvote?.wallet?.username(),
                publicKey: unvote?.wallet?.publicKey(),
                address: unvote?.wallet?.address(),
            }}
            vote={{
                name: vote?.wallet?.username(),
                publicKey: vote?.wallet?.publicKey(),
                address: vote?.wallet?.address(),
            }}
            hasHigherCustomFee={hasHigherCustomFee}
            hasLowerCustomFee={hasLowerCustomFee}
            amountTicker={wallet.currency()}
        />
    );
};

export const TransactionLedgerApprovalBody = ({ wallet, state }: Props) => {
    const {
        session,
        amount,
        receiverAddress,
        gasPrice: customGasPrice,
        gasLimit: customGasLimit,
    } = state;

    const coin = getNetworkCurrency(wallet.network());

    const {
        values: { gasPrice, gasLimit, total },
    } = useSendTransferForm(wallet, {
        session,
        amount,
        receiverAddress,
        customGasPrice,
        customGasLimit,
    });

    const fee = calculateGasFee(gasPrice, gasLimit);

    return (
        <ActionBody
            isApproved={false}
            amount={amount}
            amountTicker={coin}
            network={getNetworkCurrency(wallet.network())}
            fee={fee}
            receiver={trimAddress(receiverAddress, 10)}
            totalAmount={total}
        />
    );
};

export const SignatureLedgerApprovalBody = () => {
    const location = useLocation();
    const { state } = location;

    return <RequestedSignatureMessage data={state} className='min-h-[194px]' />;
};
