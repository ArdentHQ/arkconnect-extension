import { Contracts } from '@ardenthq/sdk-profiles';
import { DelegatesListItem } from './DelegatesListItem';

export const DelegatesList = ({
    delegates,
    isLoading,
}: {
    delegates: Contracts.IReadOnlyWallet[];
    isLoading: boolean;
}) => {
    return (
        <div className='w-full overflow-hidden rounded-xl bg-white py-2 dark:bg-subtle-black'>
            <table>
                <tbody>
                    {delegates.map((delegate) => {
                        return <DelegatesListItem key={delegate.address()} delegate={delegate} />;
                    })}
                </tbody>
            </table>
        </div>
    );
};
