import Amount from './Amount';
import { Heading } from '@/shared/components';

type BalanceProps = {
    convertedBalance?: number;
    exchangeCurrency: string;
    currency: string;
    balance: number;
};

const Balance = ({ balance, currency, exchangeCurrency, convertedBalance }: BalanceProps) => {
    return (
        <div className='flex items-center justify-between text-white'>
            <Heading $typeset='h2' fontWeight='bold'>
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
