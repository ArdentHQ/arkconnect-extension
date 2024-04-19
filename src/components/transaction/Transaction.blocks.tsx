import cn from 'classnames';
import { Icon, IconDefinition, Tooltip } from '@/shared/components';
import { TransactionType } from '@/components/home/LatestTransactions.utils';
import { useProfileContext } from '@/lib/context/Profile';
import trimAddress from '@/lib/utils/trimAddress';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';

export const TransactionIcon = ({ type }: { type: TransactionType }) => {
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
                    'h-[22px] w-[22px]': !isSpecialTransaction && type === TransactionType.RETURN,
                })}
                icon={type as IconDefinition}
            />
        </div>
    );
};

const AddressBlock = ({
    address,
    isSecondary = false,
}: {
    address: string;
    isSecondary?: boolean;
}): JSX.Element => {
    return (
        <Tooltip content={address}>
            <span className={cn({'text-theme-secondary-500 dark:text-theme-secondary-300': isSecondary})}>
                {trimAddress(address, 'short')}
            </span>
        </Tooltip>
    );
};

export const TransactionAddress = ({
    address
}: {
    address: string;
}) => {
    const primaryWallet = usePrimaryWallet();
    const network = primaryWallet?.network().id() ?? 'ark.mainnet';

    const { profile } = useProfileContext();
    const wallet = profile.wallets().findByAddressWithNetwork(address, network);
    const displayName = wallet?.displayName() || undefined;

    return displayName ? (
        <span>
            {displayName} <AddressBlock address={address} isSecondary />
        </span>
    ) : (
        <span>
            <AddressBlock address={address} />
        </span>
    );
};