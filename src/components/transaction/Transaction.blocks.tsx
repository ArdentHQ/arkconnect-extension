import cn from 'classnames';
import { TransactionType } from '../home/LatestTransactions.blocks';
import { Icon, IconDefinition } from '@/shared/components';

export const TransactionIcon = ({
    type
}: {
    type: TransactionType
}) => {
    const isSpecialTransaction = [
        TransactionType.REGISTRATION,
        TransactionType.RESIGNATION,
        TransactionType.OTHER,
        TransactionType.SECOND_SIGNATURE,
        TransactionType.MULTISIGNATURE,
    ].includes(type);

    return (
        <div className='flex h-11 min-w-11 items-center justify-center rounded-xl border border-theme-secondary-200 bg-white text-theme-secondary-500 dark:border-theme-secondary-600 dark:bg-subtle-black dark:text-theme-secondary-300'>
            <Icon
                className={cn({
                    'h-5 w-5': isSpecialTransaction,
                    'h-8 w-8': !isSpecialTransaction && type !== TransactionType.RETURN,
                    'h-[22px] w-[22px]':
                        !isSpecialTransaction && type === TransactionType.RETURN,
                })}
                icon={type as IconDefinition}
            />
        </div>
    );
};