import { useCallback, useMemo, useState } from 'react';
import useWalletSync from './useWalletSync';
import { Contracts, Environment } from '@/lib/profiles';

export const useValidators = ({
    env,
    profile,
    searchQuery,
    limit,
}: {
    env: Environment;
    profile: Contracts.IProfile;
    searchQuery: string;
    limit: number;
}) => {
    const [allValidators, setAllValidators] = useState<Contracts.IReadOnlyWallet[]>([]);
    const [currentValidator, setCurrentValidator] = useState<Contracts.IReadOnlyWallet>();
    const [votes, setVotes] = useState<Contracts.VoteRegistryItem[]>();
    const [isLoadingValidators, setIsLoadingValidators] = useState(false);
    const { syncAll } = useWalletSync({ env, profile });

    const fetchValidators = useCallback(
        async (wallet: Contracts.IReadWriteWallet) => {
            setIsLoadingValidators(true);

            await profile.validators().sync(profile, wallet.networkId());

            const allValidators = profile
                .validators()
                .all(wallet.networkId())
                .filter((validator) => !validator.isResignedValidator());

            setAllValidators(allValidators);

            const currentVote = wallet.voting().current();
            const currentVoteAddress =
                currentVote.length > 0 ? currentVote[0].wallet?.address() : undefined;
            if (currentVoteAddress) {
                const currentValidator = profile
                    .validators()
                    .findByAddress(wallet.networkId(), currentVoteAddress);
                setCurrentValidator(currentValidator);
            }

            setIsLoadingValidators(false);
        },
        [env, profile],
    );

    const validators = useMemo(() => {
        if (searchQuery.length === 0) {
            const validatorList = allValidators.slice(0, limit);
            if (
                currentValidator &&
                !validatorList.some((validator) => validator.address() === currentValidator.address())
            ) {
                validatorList.unshift(currentValidator);
            }

            return validatorList;
        }

        const query = searchQuery.toLowerCase();

        return allValidators
            .filter(
                (validator) =>
                    validator.address().toLowerCase().includes(query) ||
                    validator.username()?.toLowerCase()?.includes(query),
            )
            .slice(0, limit);
    }, [allValidators, searchQuery, limit]);

    const fetchVotes = useCallback(
        async (wallet: Contracts.IReadWriteWallet) => {
            await syncAll(wallet);

            let votes: Contracts.VoteRegistryItem[];

            try {
                votes = wallet.voting().current();
            } catch {
                votes = [];
            }

            setVotes(votes);
        },
        [profile],
    );

    const currentVotes = useMemo(() => {
        if (votes === undefined || validators === undefined) {
            return [];
        }

        return votes.filter((vote) =>
            validators.some((validator) => vote.wallet?.address() === validator.address()),
        );
    }, [votes, allValidators]);

    return {
        validators: validators ?? [],
        fetchValidators,
        fetchVotes,
        isLoadingValidators: isLoadingValidators || votes === undefined,
        currentVotes,
    };
};
