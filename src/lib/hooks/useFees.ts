import { useCallback } from 'react';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useProfileContext } from '@/lib/context/Profile';

interface CalculateProperties {
    coin: string;
    network: string;
    type: string;
}

export const useFees = () => {
    const { profile } = useProfileContext();
    const { env } = useEnvironmentContext();

    const calculateAvgFee = useCallback(
        async ({ coin, network, type }: CalculateProperties): Promise<number> => {
            await env.fees().sync(profile, coin, network);
            const transactionFees = env.fees().findByType(coin, network, type);

            return transactionFees.avg.toHuman();
        },
        [profile, env],
    );

    const calculateMaxFee = useCallback(
        async ({ coin, network, type }: CalculateProperties): Promise<number> => {
            await env.fees().sync(profile, coin, network);
            const transactionFees = env.fees().findByType(coin, network, type);

            return transactionFees.max.toHuman();
        },
        [profile, env],
    );

    const calculateMinFee = useCallback(
        async ({ coin, network, type }: CalculateProperties): Promise<number> => {
            await env.fees().sync(profile, coin, network);
            const transactionFees = env.fees().findByType(coin, network, type);

            return transactionFees.min.toHuman();
        },
        [profile, env],
    );
        

    return { calculateAvgFee, calculateMaxFee, calculateMinFee };
};
