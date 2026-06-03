import Amount from './Amount';
import { BigNumber } from '@/lib/helpers';
import { Heading } from '@/shared/components';

type BalanceProps = {
    currency: string;
    balance: BigNumber;
};

const Balance = ({ balance, currency }: BalanceProps) => {
    return (
        <div className='flex items-center justify-between text-white'>
            <Heading level={2}>
                <Amount value={balance} ticker={currency} />
            </Heading>
        </div>
    );
};

export default Balance;
