import { Networks } from '@/lib/mainsail';
import { IProfile } from '@/lib/profiles/profile.contract.js';
import { EncodeInputData, EncodeTransactionType, TransactionEncoder } from './transaction-encoder';
import { BigNumber } from '@/lib/helpers';
import { Contracts } from '@/lib/profiles';

interface Properties {
    type: EncodeTransactionType;
    data: Record<string, any> | undefined;
    network: Networks.Network;
    profile: Contracts.IProfile;
}

const gasLimit21k = BigNumber.make(21_000);
export const GasLimit: Record<Properties['type'], BigNumber> = {
    transfer: gasLimit21k,
    vote: BigNumber.make(200_000),
};

export class TransactionFeeService {
    readonly #network: Networks.Network;
    readonly #profile: Contracts.IProfile;

    public constructor({
        profile,
        network,
    }: {
        profile: IProfile;
        network: Networks.Network;
    }) {
        this.#network = network;
        this.#profile = profile;
    }

    public async gasLimit(
        transactionData: EncodeInputData,
        type: EncodeTransactionType,
    ): Promise<BigNumber> {
        const gas = await this.#network.fees().estimateGas({
            from: transactionData.senderAddress,
            ...new TransactionEncoder(this.#profile, this.#network).byType(transactionData, type),
        });

        if (!gas.isZero()) {
            // Add 20% buffer on the gas, in case the estimate is too low.
            // @see https://app.clickup.com/t/86dxe6nxx
            return gas.times(1.2).integerValue();
        }

        return GasLimit[type];
    }
}
