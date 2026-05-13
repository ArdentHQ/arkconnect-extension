import { useCallback, useEffect, useState } from 'react';
import { encodeFunctionData, numberToHex } from 'viem';
import { ConsensusAbi, MultiPaymentAbi } from '@mainsail/evm-contracts';
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

interface CreateStubTransactionProperties {
    getData: () => Record<string, any>;
    stub: boolean;
    type: string;
}

interface CalculateBySizeProperties {
    data: Record<string, any>;
    type: string;
}

interface EstimateGasProperties {
    data: Record<string, any>;
    type: string;
}

interface CalculateProperties {
    data?: Record<string, any>;
    network: string;
    type: string;
}

export const GasLimit: Record<string, BigNumber> = {
    multiPayment: BigNumber.make(21_000),
    transfer: BigNumber.make(21_000),
    vote: BigNumber.make(200_000),
};

export function getEstimateGasParams(
    formData: Record<string, any>,
    type: string,
): EstimateGasPayload {
    const { senderAddress, recipientAddress, recipients: recipientList, voteAddresses } = formData;

    const paramBuilders: Record<string, () => Omit<EstimateGasPayload, 'from'>> = {
        multiPayment: () => {
            const recipients: string[] = [];
            const amounts: BigNumber[] = [];

            for (const payment of recipientList) {
                recipients.push(payment.address);
                // @TODO https://app.clickup.com/t/86dwvx1ya get rid of extra BigNumber.make
                amounts.push(
                    BigNumber.make(UnitConverter.parseUnits(payment.amount, 'ark').toString()),
                );
            }

            const value = numberToHex(BigNumber.sum(amounts).toBigInt());

            const data = encodeFunctionData({
                abi: MultiPaymentAbi.abi,
                args: [recipients, amounts],
                functionName: 'pay',
            });

            return { data, to: ContractAddresses.MULTIPAYMENT, value };
        },
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
        ),
    );
};

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
    const { env } = useEnvironmentContext();
    const [isLoadingFee, setIsLoadingFee] = useState<boolean>(false);
    const [fees, setFees] = useState<TransactionFees>();
    const [estimatedGasLimit, setEstimatedGasLimit] = useState(BigNumber.make(0));

    const createStubTransaction = useCallback(
        async ({ type, getData, stub }: CreateStubTransactionProperties) => {
            const { mnemonic, wallet } = await profile.walletFactory().generate();

            const signatory = stub
                ? await wallet.signatory().stub(mnemonic)
                : await wallet.signatory().mnemonic(mnemonic);

            return wallet.transactionService()[type]({
                data: getData(),
                nonce: '1',
                signatory,
            });
        },
        [profile],
    );

    const calculateBySize = useCallback(
        async ({ data, type }: CalculateBySizeProperties): Promise<TransactionFeesBigNumber> => {
            try {
                const transaction = await createStubTransaction({
                    getData: () => data,
                    stub: type === 'multiSignature',
                    type,
                });

                const fees = new FeeService({ config: profile.activeNetwork().config(), profile });

                const [min, avg, max] = await Promise.all([
                    fees.calculate(transaction, { priority: 'slow' }),
                    fees.calculate(transaction, { priority: 'average' }),
                    fees.calculate(transaction, { priority: 'fast' }),
                ]);

                return {
                    avg,
                    max,
                    min,
                };
            } catch {
                return {
                    avg: BigNumber.make(0),
                    max: BigNumber.make(0),
                    min: BigNumber.make(0),
                };
            }
        },
        [createStubTransaction],
    );

    const estimateGas = useCallback(
        async ({ type, data: formData }: EstimateGasProperties) => {
            const fees = new FeeService({ config: profile.activeNetwork().config(), profile });
            return await fees.estimateGas(getEstimateGasParams(formData, type));
        },
        [profile],
    );

    const calculate = useCallback(
        async ({ network, type, data }: CalculateProperties): Promise<TransactionFeesBigNumber> => {
            await env.fees().sync(profile);
            const transactionFees = env.fees().findByType(network, type);

            if (!!data && type === 'multiSignature') {
                const feesBySize = await calculateBySize({ data, type });

                return {
                    ...feesBySize,
                };
            }

            return {
                avg: transactionFees.avg,
                max: transactionFees.max,
                min: transactionFees.min,
            };
        },
        [profile, calculateBySize, env],
    );

    useEffect(() => {
        const fetchFees = async () => {
            setIsLoadingFee(true);

            const fees = await calculate({ network, type, data });

            setFees({
                avg: fees.avg.toString(),
                min: fees.min.toString(),
                max: fees.max.toString(),
            });
            setIsLoadingFee(false);
        };

        void fetchFees();
    }, [calculate, network, type, data]);

    useEffect(() => {
        /* istanbul ignore else -- @preserve */
        const isMultiPayment = type === 'multiPayment';
        const recipientsCount =
            isMultiPayment && Array.isArray(data?.payments) ? data.payments.length : 1;
        const fallbackGasLimit = isMultiPayment
            ? GasLimit.multiPayment.times(recipientsCount)
            : GasLimit[type];

        setEstimatedGasLimit(fallbackGasLimit);

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
