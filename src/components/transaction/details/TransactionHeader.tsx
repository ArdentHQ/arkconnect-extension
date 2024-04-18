import { getTitle, TransactionType } from '@/components/home/LatestTransactions.utils';
import { TransactionIcon } from '@/components/transaction/Transaction.blocks';

export const TransactionHeader = ({ type }: { type: TransactionType }) => {
    return (
        <div className='flex flex-row items-center gap-3'>
            <TransactionIcon type={type} />
            <h4 className='text-base font-medium leading-5 text-light-black dark:text-white'>
                {getTitle(type)}
            </h4>
        </div>
    );
};
