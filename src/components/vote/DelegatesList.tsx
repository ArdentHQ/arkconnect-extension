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
        <div className='space-y-2'>
            {delegates.map((delegate) => {
                return <DelegatesListItem key={delegate.address} delegate={delegate} />;
            })}
        </div>
    );
};
