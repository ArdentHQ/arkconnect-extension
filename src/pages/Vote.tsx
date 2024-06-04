import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { useDelegates } from '@/lib/hooks/useDelegates';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useProfileContext } from '@/lib/context/Profile';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { assertWallet } from '@/lib/utils/assertions';
import { DelegatesList } from '@/components/vote/DelegatesList';
import { DelegatesSearchInput } from '@/components/vote/DelegatesSearchInput';

const Vote = () => {
    const { t } = useTranslation();
    const { profile } = useProfileContext();
    const { env } = useEnvironmentContext();
    const wallet = usePrimaryWallet();

    assertWallet(wallet);

    const delegatesPerPage = useMemo(() => wallet.network().delegateCount(), [wallet]);

    const [searchQuery, setSearchQuery] = useState<string>('');

    const { delegates, fetchDelegates, isLoadingDelegates } = useDelegates({
        env,
        profile,
        searchQuery,
    });

    useEffect(() => {
        fetchDelegates(wallet);
    }, [wallet]);

    return (
        <SubPageLayout title={t('PAGES.VOTE.VOTE')}>
            <DelegatesSearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <DelegatesList
                delegates={delegates.slice(0, delegatesPerPage)}
                isLoading={isLoadingDelegates}
            />
        </SubPageLayout>
    );
};

export default Vote;
