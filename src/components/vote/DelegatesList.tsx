import { Contracts } from '@ardenthq/sdk-profiles';
import { DelegatesListItem } from './DelegatesListItem';
import { DelegatesListItemSkeleton } from './DelegatesListItemSkeleton';

export const DelegatesList = ({
    delegates,
    isLoading,
    onDelegateSelected,
    votes,
    selectedDelegate,
}: {
    delegates: Contracts.IReadOnlyWallet[];
    isLoading: boolean;
    onDelegateSelected: (delegate?: Contracts.IReadOnlyWallet) => void;
    votes: Contracts.VoteRegistryItem[];
    selectedDelegate?: Contracts.IReadOnlyWallet;
}) => {
    if (isLoading) {
        return (
            <div className='w-full overflow-hidden rounded-xl bg-white py-2 dark:bg-subtle-black'>
                <table className='w-full'>
                    <tbody>
                        {Array.from({ length: 10 }).map((_, index) => {
                            return <DelegatesListItemSkeleton key={index} />;
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className='w-full overflow-hidden rounded-xl bg-white py-2 dark:bg-subtle-black'>
            <table className='w-full'>
                <tbody>
                    {delegates.map((delegate) => {
                        return (
                            <DelegatesListItem
                                onSelected={onDelegateSelected}
                                key={delegate.address()}
                                delegate={delegate}
                                isSelected={selectedDelegate?.address() === delegate.address()}
                                isVoted={votes.some(
                                    (vote) => vote.wallet?.address() === delegate.address(),
                                )}
                                anyIsSelected={selectedDelegate !== undefined}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
