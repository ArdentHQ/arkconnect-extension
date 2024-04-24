import { twMerge } from 'tailwind-merge';
import { ExtendedConfirmedTransactionData } from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
import {
    getType,
    TransactionType,
} from '@/components/home/LatestTransactions.utils';
import { TransactionIcon } from '@/components/transaction/Transaction.blocks';
import { MultipaymentBadge, TransactionTitle } from '@/components/home/LatestTransactions.blocks';

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
            <h4 className='text-base font-medium leading-5 text-light-black dark:text-white'>
                <TransactionTitle type={type} isSender={transaction.isSent()} />{' '}
                {type === TransactionType.MULTIPAYMENT && <MultipaymentBadge />}
            </h4>
        </div>
    );
};
