import Amount from './Amount';
import { Heading, Paragraph } from '@/shared/components';

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
                <Paragraph className='typeset-headline' fontWeight='medium'>
                    <Amount value={convertedBalance} ticker={exchangeCurrency} withTicker />
                </Paragraph>
            )}
        </div>
    );
};

export default Balance;
