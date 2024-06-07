import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { Contracts } from '@ardenthq/sdk-profiles';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { useDelegates } from '@/lib/hooks/useDelegates';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useProfileContext } from '@/lib/context/Profile';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { assertWallet } from '@/lib/utils/assertions';
import { DelegatesList } from '@/components/vote/DelegatesList';
import { VoteButton } from '@/components/vote/VoteButton';
import { DelegatesSearchInput } from '@/components/vote/DelegatesSearchInput';

const Vote = () => {
    const { t } = useTranslation();
    const { profile } = useProfileContext();
    const { env } = useEnvironmentContext();
    const wallet = usePrimaryWallet();

    assertWallet(wallet);

    const delegateCount = useMemo(() => wallet.network().delegateCount(), [wallet]);

    const [searchQuery, setSearchQuery] = useState<string>('');

    const { delegates, fetchDelegates, fetchVotes, currentVotes, isLoadingDelegates } =
        useDelegates({
            env,
            profile,
            searchQuery,
            limit: delegateCount,
        });

    const [selectedDelegate, setSelectedDelegate] = useState<
        Contracts.IReadOnlyWallet | undefined
    >();

    useEffect(() => {
        fetchDelegates(wallet);

        fetchVotes(wallet.address(), wallet.network().id());
    }, [wallet]);

    return (
        <SubPageLayout
            title={t('PAGES.VOTE.VOTE')}
            className='flex flex-1 flex-col'
            bodyClassName='flex-1 flex flex-col pb-4'
            footer={<VoteButton onClick={() => {}} disabled={true} />}
        >
            <DelegatesSearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <DelegatesList
                onDelegateSelected={(delegate) => {
                    setSelectedDelegate(delegate);
                }}
                delegates={delegates.slice(0, delegateCount)}
                isLoading={isLoadingDelegates}
                votes={currentVotes}
                selectedDelegate={selectedDelegate}
            />
        </SubPageLayout>
    );
};

export default Vote;
