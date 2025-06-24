import { useCallback } from 'react';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useProfileContext } from '@/lib/context/Profile';

interface CalculateProperties {
    network: string;
    type: string;
}

export const useFees = () => {
    const { profile } = useProfileContext();
    const { env } = useEnvironmentContext();

    const calculateAvgFee = useCallback(
        async ({ network, type }: CalculateProperties): Promise<number> => {
            await env.fees().sync(profile);
            const transactionFees = env.fees().findByType(network, type);

            return transactionFees.avg.toHuman();
        },
        [profile, env],
    );

    const calculateMaxFee = useCallback(
        async ({ network, type }: CalculateProperties): Promise<number> => {
            await env.fees().sync(profile);
            const transactionFees = env.fees().findByType(network, type);

            return transactionFees.max.toHuman();
        },
        [profile, env],
    );

    const calculateMinFee = useCallback(
        async ({ network, type }: CalculateProperties): Promise<number> => {
            await env.fees().sync(profile);
            const transactionFees = env.fees().findByType(network, type);

            return transactionFees.min.toHuman();
        },
        [profile, env],
    );

    return { calculateAvgFee, calculateMaxFee, calculateMinFee };
};
