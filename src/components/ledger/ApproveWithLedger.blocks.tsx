import { useLocation } from 'react-router-dom';
import { Contracts } from '@ardenthq/sdk-profiles';
import RequestedSignatureMessage from '../approve/RequestedSignatureMessage';
import { ActionBody } from '../approve/ActionBody';
import trimAddress from '@/lib/utils/trimAddress';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';
import { useSendTransferForm } from '@/lib/hooks/useSendTransferForm';
import { useVoteForm } from '@/lib/hooks/useVoteForm';
import * as SessionStore from '@/lib/store/session';

type VoteDelegateProperties = {
    address: string;
    amount: number;
};
interface Props {
    wallet: Contracts.IReadWriteWallet;
    state: {
        amount: number;
        receiverAddress: string;
        domain: string;
        session: SessionStore.Session;
        vote: VoteDelegateProperties;
        unvote: VoteDelegateProperties;
        tabId: number;
        memo?: string;
        fee?: number;
    };
}

export const VoteLedgerApprovalBody = ({ wallet, state }: Props) => {
    const { session, amount, receiverAddress, fee: customFee } = state;

    const {
        values: { hasHigherCustomFee, hasLowerCustomFee },
    } = useSendTransferForm(wallet, {
        session,
        amount: amount ?? 0,
        receiverAddress,
        customFee,
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
            fee={customFee || fee}
            convertedFee={convert(fee)}
            exchangeCurrency={wallet.exchangeCurrency() ?? 'USD'}
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
    const { session, amount, receiverAddress, memo, fee: customFee } = state;
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
        memo,
        customFee,
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
            memo={memo}
        />
    );
};

export const SignatureLedgerApprovalBody = () => {
    const location = useLocation();
    const { state } = location;

    return <RequestedSignatureMessage data={state} className='min-h-[194px]' />;
};
