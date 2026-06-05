import Amount from './Amount';
import { BigNumber } from '@/lib/helpers';
import { Heading } from '@/shared/components';

type BalanceProps = {
    convertedBalance?: BigNumber;
    exchangeCurrency: string;
    currency: string;
    balance: BigNumber;
};

const Balance = ({ balance, currency, exchangeCurrency, convertedBalance }: BalanceProps) => {
    return (
        <div className='flex items-center justify-between text-white'>
            <Heading level={2}>
                <Amount value={balance} ticker={currency} />
            </Heading>

            {convertedBalance !== undefined && (
                <p className='typeset-headline font-medium'>
                    <Amount value={convertedBalance} ticker={exchangeCurrency} withTicker />
                </p>
            )}
        </div>
    );
};

export default Balance;
