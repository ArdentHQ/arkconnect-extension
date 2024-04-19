import { twMerge } from 'tailwind-merge';
import { ExtendedConfirmedTransactionData } from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
import { getTitle, getType, TransactionType } from '@/components/home/LatestTransactions.utils';
import { TransactionIcon } from '@/components/transaction/Transaction.blocks';

export const TransactionHeader = ({ transaction, className }: { transaction: ExtendedConfirmedTransactionData, className?: string }) => {
    const type= getType(transaction);

    return (
        <div className={twMerge('flex flex-row items-center gap-3', className)}>
            <TransactionIcon type={type as TransactionType} />
            <h4 className='text-base font-medium leading-5 text-light-black dark:text-white'>
                {getTitle(type)}
            </h4>
        </div>
    );
};
