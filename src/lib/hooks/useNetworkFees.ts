import { useCallback, useEffect, useState } from 'react';
import { encodeFunctionData } from 'viem';
import { ConsensusAbi } from '@mainsail/evm-contracts';
import { ContractAddresses, UnitConverter } from '@arkecosystem/typescript-crypto';
import { BigNumber } from '@/lib/helpers';
import { Contracts } from '@/lib/profiles';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { EstimateGasPayload } from '@/lib/mainsail/fee.contract';
import { FeeService } from '@/lib/mainsail/fee.service';

export interface TransactionFees {
    max: string;
    min: string;
    avg: string;
}

export interface TransactionFeesBigNumber {
    max: BigNumber;
    min: BigNumber;
    avg: BigNumber;
}

interface EstimateGasProperties {
    data: Record<string, any>;
    type: string;
}

interface CalculateProperties {
    network: string;
    type: string;
}

export const GasLimit: Record<string, BigNumber> = {
    tokenTransfer: BigNumber.make(65_000),
    transfer: BigNumber.make(21_000),
    vote: BigNumber.make(200_000),
};

export function getEstimateGasParams(
    formData: Record<string, any>,
    type: string,
): EstimateGasPayload {
    const { senderAddress, recipientAddress, voteAddresses } = formData;

    const paramBuilders: Record<string, () => Omit<EstimateGasPayload, 'from'>> = {
        transfer: () => ({ to: recipientAddress as string }),
        vote: () => {
            const vote = (voteAddresses as string[]).at(0);
            const isVote = !!vote;

            const data = encodeFunctionData({
                abi: ConsensusAbi.abi,
                args: isVote ? [vote] : [],
                functionName: isVote ? 'vote' : 'unvote',
            });

            return { data, to: ContractAddresses.CONSENSUS };
        },
    };

    return {
        from: senderAddress,
        ...paramBuilders[type](),
    };
}

export const calculateGasFee = (gasPrice?: string, gasLimit?: string): BigNumber => {
    if (!gasPrice || !gasLimit) {
        return BigNumber.ZERO;
    }

    return BigNumber.make(
        UnitConverter.formatUnits(
            BigNumber.make(gasLimit).times(BigNumber.make(gasPrice)).toString(),
            'gwei',
        ).toString(),
    );
};

export const useNetworkFees = ({
    profile,
    network,
    type,
}: {
    profile: Contracts.IProfile;
    network: string;
    type: string;
}) => {
    const { env } = useEnvironmentContext();
    const [isLoadingFee, setIsLoadingFee] = useState<boolean>(false);
    const [fees, setFees] = useState<TransactionFees>();
    const [estimatedGasLimit, setEstimatedGasLimit] = useState(BigNumber.make(0));

    const estimateGas = useCallback(
        async ({ type, data: formData }: EstimateGasProperties) => {
            const fees = new FeeService({ config: profile.activeNetwork().config(), profile });
            return await fees.estimateGas(getEstimateGasParams(formData, type));
        },
        [profile],
    );

    const calculate = useCallback(
        async ({ network, type }: CalculateProperties): Promise<TransactionFeesBigNumber> => {
            await env.fees().sync(profile);
            const transactionFees = env.fees().findByType(network, type);

            return {
                avg: transactionFees.avg,
                max: transactionFees.max,
                min: transactionFees.min,
            };
        },
        [profile, env],
    );

    useEffect(() => {
        const fetchFees = async () => {
            setIsLoadingFee(true);

            const fees = await calculate({ network, type });

            setFees({
                avg: fees.avg.toString(),
                min: fees.min.toString(),
                max: fees.max.toString(),
            });
            setIsLoadingFee(false);
        };

        void fetchFees();
    }, [calculate, network, type]);

    useEffect(() => {
        /* istanbul ignore else -- @preserve */
        setEstimatedGasLimit(GasLimit[type]);

        // TODO enable gas limit estimations
        // const estimate = async () => {
        //     let gasLimit = fallbackGasLimit;
        //
        //     try {
        //         gasLimit = await estimateGas({ data: data ?? {}, type });
        //     } catch (error) {
        //         console.warn(error);
        //     }
        //
        //     setEstimatedGasLimit(gasLimit);
        // };
        //
        // void estimate();
    }, [estimateGas, type]);

    return { isLoadingFee, fees, estimatedGasLimit };
};
