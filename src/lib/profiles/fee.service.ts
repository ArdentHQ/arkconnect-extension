import { Services } from '@/lib/mainsail';

import { IProfile } from './contracts.js';
import { DataRepository } from './data.repository.js';

export class ProfileFeeService {
    readonly #dataRepository: DataRepository = new DataRepository();

    public all(coinOrNetworkId: string, networkId?: string): Services.TransactionFees {
        const id = networkId ?? coinOrNetworkId;
        const result: Services.TransactionFees | undefined = this.#dataRepository.get(`${id}.fees`);

        if (result === undefined) {
            throw new Error(
                `The fees for [${id}] have not been synchronized yet. Please call [syncFees] before using this method.`,
            );
        }

        return result;
    }

    public findByType(network: string, type: string): Services.TransactionFee {
        return this.all(network)[type];
    }

    public async sync(profile: IProfile): Promise<void> {
        this.#dataRepository.set(
            `${profile.activeNetwork().id()}.fees`,
            await profile.activeNetwork().fees().all(),
        );
    }
}
