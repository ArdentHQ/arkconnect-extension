import { Contracts } from '@ardenthq/sdk-profiles';
import Amount from '../wallet/Amount';
import ActionDetails, {
    ActionDetailsFiatValue,
    ActionDetailsRow,
    ActionDetailsValue,
} from './ActionDetails';
import { getNetworkCurrency } from '@/lib/utils/getActiveCoin';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';
import { Address } from '@/components/wallet/address/Address.blocks';
import { HigherFeeWarning } from '@/components/approve/HigherCustomFee.blocks';


type Props = {
    amount: number;
    total: number;
    fee: number;
    receiverAddress: string;
    wallet: Contracts.IReadWriteWallet;
    hasHigherCustomFee: number | null;
};

const RequestedTransactionBody = ({
    wallet,
    amount,
    fee,
    total,
    receiverAddress,
    hasHigherCustomFee,
}: Props) => {
    const exchangeCurrency = wallet.exchangeCurrency() ?? 'USD';

    const coin = getNetworkCurrency(wallet.network());

    const { convert } = useExchangeRate({
        exchangeTicker: wallet.exchangeCurrency(),
        ticker: wallet.currency(),
    });

    const withFiat = wallet.network().isLive();

    return (
        <ActionDetails>
            <ActionDetailsRow
                label='Amount'
                below={
                    withFiat && (
                        <ActionDetailsFiatValue>
                            <Amount
                                value={convert(amount)}
                                ticker={coin}
                                withTicker
                                underlineOnHover={true}
                                tooltipPlacement='bottom-end'
                            />
                        </ActionDetailsFiatValue>
                    )
                }
            >
                <div className='flex items-center gap-4'>
                    <ActionDetailsValue>
                        <Amount
                            value={amount}
                            ticker={coin}
                            withTicker
                            underlineOnHover={true}
                            tooltipPlacement='bottom-end'
                        />
                    </ActionDetailsValue>
                </div>
            </ActionDetailsRow>

            <ActionDetailsRow label='Receiver'>
                <Address
                    address={receiverAddress}
                    tooltipPlacement='bottom-end'
                    length={10}
                    classNames='leading-5 font-medium text-light-black dark:text-white'
                />
            </ActionDetailsRow>

            <ActionDetailsRow
                label={
                    <span className='flex items-center gap-1'>
                        Transaction Fee{' '}
                        {hasHigherCustomFee && (
                            <HigherFeeWarning averageFee={hasHigherCustomFee} coin={coin} />
                        )}
                    </span>
                }
                below={
                    withFiat && (
                        <ActionDetailsFiatValue>
                            <Amount
                                value={convert(fee)}
                                ticker={exchangeCurrency}
                                underlineOnHover={true}
                                tooltipPlacement='bottom-end'
                            />
                        </ActionDetailsFiatValue>
                    )
                }
            >
                <div className='flex items-center gap-4'>
                    <ActionDetailsValue>
                        <Amount
                            value={fee}
                            ticker={coin}
                            withTicker
                            underlineOnHover={true}
                            tooltipPlacement='bottom-end'
                        />
                    </ActionDetailsValue>
                </div>
            </ActionDetailsRow>

            <ActionDetailsRow
                label='Total Amount'
                below={
                    withFiat && (
                        <ActionDetailsFiatValue>
                            <Amount
                                value={convert(total)}
                                ticker={exchangeCurrency}
                                underlineOnHover={true}
                                tooltipPlacement='bottom-end'
                            />
                        </ActionDetailsFiatValue>
                    )
                }
            >
                <div className='flex items-center gap-4'>
                    <ActionDetailsValue>
                        <Amount
                            value={total}
                            ticker={coin}
                            withTicker
                            underlineOnHover={true}
                            tooltipPlacement='bottom-end'
                        />
                    </ActionDetailsValue>
                </div>
            </ActionDetailsRow>
        </ActionDetails>
    );
};

export default RequestedTransactionBody;
