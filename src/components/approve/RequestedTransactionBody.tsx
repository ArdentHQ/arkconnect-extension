import { Contracts } from '@ardenthq/sdk-profiles';
import Amount from '../wallet/Amount';
import ActionDetails, { ActionDetailsRow } from './ActionDetails';
import trimAddress from '@/lib/utils/trimAddress';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';

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

    return (
        <ActionDetails>
            <ActionDetailsRow label='Amount'>
                <div className='flex items-center gap-4'>
                    <div className='font-medium text-light-black dark:text-white'>
                        <Amount value={amount} ticker={coin} withTicker />
                    </div>

                    {wallet.network().isLive() && (
                        <div className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                            <Amount value={convert(amount)} ticker={exchangeCurrency} />
                        </div>
                    )}
                </div>
            </ActionDetailsRow>

            <ActionDetailsRow label='Receiver'>
                <div className='font-medium text-light-black dark:text-white'>
                    {trimAddress(receiverAddress as string, 10)}
                </div>
            </ActionDetailsRow>

            <ActionDetailsRow label='Transaction Fee'>
                <div className='flex items-center gap-4'>
                    <div className='font-medium text-light-black dark:text-white'>
                        <Amount value={fee} ticker={coin} withTicker />
                    </div>
                    {wallet.network().isLive() && (
                        <div className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                            <Amount value={convert(fee)} ticker={exchangeCurrency} />
                        </div>
                    )}
                </div>
            </ActionDetailsRow>

            <ActionDetailsRow label='Total Amount'>
                <div className='flex items-center gap-4'>
                    <div className='font-medium text-light-black dark:text-white'>
                        <Amount value={total} ticker={coin} withTicker />
                    </div>
                    {wallet.network().isLive() && (
                        <div className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                            <Amount value={convert(total)} ticker={exchangeCurrency} />
                        </div>
                    )}
                </div>
            </ActionDetailsRow>
        </ActionDetails>
    );
};

export default RequestedTransactionBody;
