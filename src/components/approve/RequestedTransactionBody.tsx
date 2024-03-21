import { Contracts } from '@ardenthq/sdk-profiles';
import { ActionBody } from './ActionBody';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';
import trimAddress from '@/lib/utils/trimAddress';

type Props = {
    amount: number;
    total: number;
    fee: number;
    receiverAddress: string;
    wallet: Contracts.IReadWriteWallet;
};

const RequestedTransactionBody = ({ wallet, amount, fee, total, receiverAddress }: Props) => {
    const exchangeCurrency = wallet.exchangeCurrency() ?? 'USD';

    const coin = getNetworkCurrency(wallet.network());

    const { convert } = useExchangeRate({
        exchangeTicker: wallet.exchangeCurrency(),
        ticker: wallet.currency(),
    });

    const withFiat = wallet.network().isLive();

    return (
        <ActionBody
            isApproved={false}
            showFiat={withFiat}
            amount={amount}
            amountTicker={coin}
            convertedAmount={convert(amount)}
            exchangeCurrency={exchangeCurrency}
            walletNetwork={wallet.network()}
            fee={fee}
            convertedFee={convert(fee)}
            receiver={trimAddress(receiverAddress as string, 10)}
            totalAmount={total}
            convertedTotalAmount={convert(total)}
        />
    );
};

export default RequestedTransactionBody;
