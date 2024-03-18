import {Contracts} from '@ardenthq/sdk-profiles';
import Amount from '../wallet/Amount';
import ActionDetails, {ActionDetailsRow} from './ActionDetails';
import {getNetworkCurrency} from '@/lib/utils/getActiveCoin';
import {useExchangeRate} from '@/lib/hooks/useExchangeRate';
import {Address} from "@/components/wallet/address/Address.blocks";

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
                        <Amount value={amount} ticker={coin} withTicker underlineOnHover={true}
                                tooltipPlacement='bottom-end' />
                    </div>

                    {wallet.network().isLive() && (
                        <div className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                            <Amount value={convert(amount)} ticker={exchangeCurrency} underlineOnHover={true} tooltipPlacement='bottom-end' />
                        </div>
                    )}
                </div>
            </ActionDetailsRow>

            <ActionDetailsRow label='Receiver'>
                <Address address={receiverAddress} tooltipPlacement='bottom-end' length={10} classNames="text-base leading-5 font-medium text-light-black dark:text-white"/>
            </ActionDetailsRow>

            <ActionDetailsRow label='Transaction Fee'>
                <div className='flex items-center gap-4'>
                    <div className='font-medium text-light-black dark:text-white'>
                        <Amount value={fee} ticker={coin} withTicker underlineOnHover={true}
                                tooltipPlacement='bottom-end' />
                    </div>
                    {wallet.network().isLive() && (
                        <div className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                            <Amount value={convert(fee)} ticker={exchangeCurrency} underlineOnHover={true} tooltipPlacement='bottom-end' />
                        </div>
                    )}
                </div>
            </ActionDetailsRow>

            <ActionDetailsRow label='Total Amount'>
                <div className='flex items-center gap-4'>
                    <div className='font-medium text-light-black dark:text-white'>
                        <Amount value={total} ticker={coin} withTicker underlineOnHover={true}
                                tooltipPlacement='bottom-end' />
                    </div>
                    {wallet.network().isLive() && (
                        <div className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                            <Amount value={convert(total)} ticker={exchangeCurrency} underlineOnHover={true} tooltipPlacement='bottom-end'/>
                        </div>
                    )}
                </div>
            </ActionDetailsRow>
        </ActionDetails>
    );
};

export default RequestedTransactionBody;
