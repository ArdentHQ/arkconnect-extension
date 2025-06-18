import { Hex, decodeFunctionData as viemDecodeFunctionData } from 'viem';
import { ConsensusAbi, MultiPaymentAbi, UsernamesAbi } from '@mainsail/evm-contracts';

interface FunctionData {
    functionName: string;
    args: any[];
}

export enum AbiType {
    'Consensus' = 'consensus',
    'Username' = 'username',
    'MultiPayment' = 'multiPayment',
}

export const decodeFunctionData = (
    data: Hex,
    abiType: AbiType = AbiType.Consensus,
): FunctionData => {
    const abiMap: Record<AbiType, any> = {
        [AbiType.Consensus]: ConsensusAbi.abi,
        [AbiType.Username]: UsernamesAbi.abi,
        [AbiType.MultiPayment]: MultiPaymentAbi.abi,
    };

    try {
        return viemDecodeFunctionData({
            abi: abiMap[abiType],
            data,
        }) as FunctionData;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }

        throw new Error('Error occurred while decoding data');
    }
};
