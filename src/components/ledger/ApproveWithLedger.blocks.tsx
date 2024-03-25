import { useLocation } from 'react-router-dom';
import { Contracts } from '@ardenthq/sdk-profiles';
import RequestedSignatureMessage from '../approve/RequestedSignatureMessage';
import { ActionBody } from '../approve/ActionBody';
import trimAddress from '@/lib/utils/trimAddress';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';
import { useSendTransferForm } from '@/lib/hooks/useSendTransferForm';
import { useVoteForm } from '@/lib/hooks/useVoteForm';

interface Props {
    wallet: Contracts.IReadWriteWallet;
}

export const VoteLedgerApprovalBody = ({ wallet }: Props) => {
    const location = useLocation();
    const { state } = location;
    const { session, amount, receiverAddress } = state;

    const {
        values: { hasHigherCustomFee },
    } = useSendTransferForm(wallet, {
        session,
        amount,
        receiverAddress,
    });

    const { convert } = useExchangeRate({
        exchangeTicker: wallet.exchangeCurrency(),
        ticker: wallet.currency(),
    });

    const {
        values: { fee, vote, unvote },
    } = useVoteForm(wallet, state);

    return (
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
    );
};

export const TransactionLedgerApprovalBody = ({ wallet }: Props) => {
    const location = useLocation();
    const { state } = location;
    const { session, amount, receiverAddress } = state;
    const { convert } = useExchangeRate({
        exchangeTicker: wallet.exchangeCurrency(),
        ticker: wallet.currency(),
    });
    const exchangeCurrency = wallet.exchangeCurrency() ?? 'USD';
    const coin = getNetworkCurrency(wallet.network());
    const withFiat = wallet.network().isLive();

    const {
        values: { fee, total },
    } = useSendTransferForm(wallet, {
        session,
        amount,
        receiverAddress,
    });

    return (
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
    );
};

export const SignatureLedgerApprovalBody = () => {
    const location = useLocation();
    const { state } = location;

    return (
        <div className='h-[191px]'>
            <RequestedSignatureMessage data={state} />
        </div>
    );
};
