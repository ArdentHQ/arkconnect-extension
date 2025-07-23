import { useLocation } from 'react-router-dom';
import RequestedSignatureMessage from '../approve/RequestedSignatureMessage';
import { ActionBody } from '../approve/ActionBody';
import { Contracts } from '@/lib/profiles';
import trimAddress from '@/lib/utils/trimAddress';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';
import { useSendTransferForm } from '@/lib/hooks/useSendTransferForm';
import { useVoteForm } from '@/lib/hooks/useVoteForm';
import * as SessionStore from '@/lib/store/session';
import { calculateGasFee } from '@/lib/hooks/useNetworkFees';

type VoteDelegateProperties = {
    address: string;
    amount: number;
};
interface Props {
    wallet: Contracts.IReadWriteWallet;
    state: {
        value: string;
        to: string;
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
    const { convert } = useExchangeRate({
        exchangeTicker: wallet.exchangeCurrency(),
        ticker: wallet.currency(),
    });

    const {
        values: { gasPrice, gasLimit, vote, unvote, hasLowerCustomFee, hasHigherCustomFee },
    } = useVoteForm(wallet, state);

    const fee = calculateGasFee(gasPrice, gasLimit);

    return (
        <ActionBody
            isApproved={false}
            showFiat={wallet.network().isLive()}
            wallet={wallet}
            fee={+fee}
            convertedFee={convert(+fee)}
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
    const { session, value, to, gasPrice: customGasPrice, gasLimit: customGasLimit } = state;

    const { convert } = useExchangeRate({
        exchangeTicker: wallet.exchangeCurrency(),
        ticker: wallet.currency(),
    });
    const exchangeCurrency = wallet.exchangeCurrency() ?? 'USD';
    const coin = getNetworkCurrency(wallet.network());
    const withFiat = wallet.network().isLive();

    const {
        values: { gasPrice, gasLimit, total },
    } = useSendTransferForm(wallet, {
        session,
        amount: value,
        receiverAddress: to,
        customGasPrice,
        customGasLimit,
    });

    const fee = calculateGasFee(gasPrice, gasLimit);

    return (
        <ActionBody
            isApproved={false}
            showFiat={withFiat}
            amount={+value}
            amountTicker={coin}
            convertedAmount={convert(+value)}
            exchangeCurrency={exchangeCurrency}
            network={getNetworkCurrency(wallet.network())}
            fee={+fee}
            convertedFee={convert(+fee)}
            receiver={trimAddress(to as string, 10)}
            totalAmount={total}
            convertedTotalAmount={convert(total)}
        />
    );
};

export const SignatureLedgerApprovalBody = () => {
    const location = useLocation();
    const { state } = location;

    return <RequestedSignatureMessage data={state} className='min-h-[194px]' />;
};
