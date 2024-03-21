import { useLocation } from 'react-router-dom';
import { ActionBody } from './ActionBody';
import trimAddress from '@/lib/utils/trimAddress';
import getActiveCoin from '@/lib/utils/getActiveCoin';
import { WalletNetwork } from '@/lib/store/wallet';

const TransactionApprovedBody = () => {
    const { state } = useLocation();

    const showFiat = state.walletNetwork === WalletNetwork.MAINNET;

    return (
        <div className='w-full'>
            <ActionBody 
                isApproved
                sender={trimAddress(state?.transaction.sender, 'short')}
                amount={state?.transaction.amount}
                convertedAmount={state?.transaction.convertedAmount as number}
                exchangeCurrency={state?.transaction.exchangeCurrency as string}
                network={getActiveCoin(state?.walletNetwork)}
                showFiat={showFiat}
                receiver={trimAddress(state?.transaction.receiver, 'short')}
                fee={state?.transaction.fee}
                convertedFee={state?.transaction.convertedFee as number}
                totalAmount={state?.transaction.total}
                convertedTotalAmount={state?.transaction.convertedTotal as number}
                amountTicker={getActiveCoin(state?.walletNetwork)}
                transactionId={state?.transaction.id}
                maxHeight='229px'
            />
        </div>
    );
};

export default TransactionApprovedBody;
