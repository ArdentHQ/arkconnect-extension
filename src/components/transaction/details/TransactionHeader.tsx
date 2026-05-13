import { twMerge } from 'tailwind-merge';
import { getType, TransactionType } from '@/components/home/LatestTransactions.utils';
import { TransactionIcon } from '@/components/transaction/Transaction.blocks';
import { MultipaymentBadge, TransactionTitle } from '@/components/home/LatestTransactions.blocks';
import { ExtendedConfirmedTransactionData } from '@/lib/profiles/transaction.dto';

export const TransactionHeader = ({
    transaction,
    className,
}: {
    transaction: ExtendedConfirmedTransactionData;
    className?: string;
}) => {
    let subtype;
    const type = getType(transaction);

    if (type === TransactionType.MULTIPAYMENT) {
        subtype = transaction.isSent() ? TransactionType.SEND : TransactionType.RECEIVE;
    }

    return (
        <div className={twMerge('flex flex-row items-center gap-3', className)}>
            <TransactionIcon type={subtype || (type as TransactionType)} />
            <h4 className='text-light-black text-base leading-5 font-medium dark:text-white'>
                <TransactionTitle type={type} isSender={transaction.isSent()} />{' '}
                {type === TransactionType.MULTIPAYMENT && <MultipaymentBadge />}
            </h4>
        </div>
    );
};
