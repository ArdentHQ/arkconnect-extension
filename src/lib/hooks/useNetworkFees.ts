import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from '@/lib/helpers';
import { Contracts } from '@/lib/profiles';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { TransactionFee } from '@/lib/mainsail/fee.contract';

export interface TransactionFees {
    max: string;
    min: string;
    avg: string;
}

interface CalculateProperties {
    data?: Record<string, any>;
    network: string;
    type: string;
}

export const useNetworkFees = ({
    profile,
    network,
    type,
    data,
}: {
    profile: Contracts.IProfile;
    network: string;
    type: string;
    data?: Record<string, any>;
}) => {
    const [isLoadingFee, setIsLoadingFee] = useState<boolean>(false);
    const [fees, setFees] = useState<TransactionFees>();
    const { env } = useEnvironmentContext();

    const roundAndFormat = (value: BigNumber): string => {
        return parseFloat(value.toHuman().toFixed(4)).toString();
    };

    const calculate = useCallback(
        async ({ network, type }: CalculateProperties): Promise<TransactionFees> => {
            let transactionFees: TransactionFee;

            try {
                transactionFees = env.fees().findByType(network, type);
            } catch {
                await env.fees().sync(profile);

                transactionFees = env.fees().findByType(network, type);
            }

            return {
                avg: roundAndFormat(transactionFees.avg),
                max: roundAndFormat(transactionFees.max),
                min: roundAndFormat(transactionFees.min),
            };
        },
        [profile, env],
    );

    useEffect(() => {
        const fetchFees = async () => {
            setIsLoadingFee(true);

            const fees = await calculate({ network, type, data });

            setFees(fees);
            setIsLoadingFee(false);
        };

        fetchFees();
    }, [calculate, network, type, data]);

    return { isLoadingFee, fees };
};
