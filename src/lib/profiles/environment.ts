import Joi from 'joi';

import { IDataRepository } from './contracts.js';
import { EnvironmentOptions, Storage, StorageData } from './environment.models.js';
import { DataRepository } from './data.repository.js';
import { ProfileFeeService } from './fee.service.js';
import { ProfileRepository } from './profile.repository.js';
import { WalletService } from './wallet.service.js';

export class Environment {
    #storage!: Storage;
    #data!: DataRepository;
    #fees!: ProfileFeeService;
    #profiles!: ProfileRepository;
    #wallets!: WalletService;

    public constructor(options: EnvironmentOptions) {
        this.reset(options);
    }

    public async verify(storageData?: StorageData): Promise<void> {
        const storage = storageData ?? (await this.#storage.all<StorageData>());

        const data: object = storage.data || {};
        const profiles: object = storage.profiles || {};

        const { error, value } = Joi.object({
            data: Joi.object().required(),
            profiles: Joi.object().pattern(Joi.string().uuid(), Joi.object()).required(),
        }).validate({ data, profiles }, { allowUnknown: true, stripUnknown: true });

        if (error) {
            throw new Error(`Terminating due to corrupted state: ${String(error)}`);
        }

        this.#storage.set('data', value.data);
        this.#storage.set('profiles', value.profiles);
    }

    public async boot(): Promise<void> {
        if (this.#storage === undefined) {
            throw new Error('Please call [verify] before booting the environment.');
        }

        const storage = await this.#storage.all<StorageData>();

        if (Object.keys(storage.data).length > 0) {
            this.data().fill(storage.data);
        }

        if (Object.keys(storage.profiles).length > 0) {
            this.profiles().fill(storage.profiles);
        }

        await this.updateVersion();
    }

    public async persist(): Promise<void> {
        const profile = this.profiles().first();

        if (profile) {
            await this.profiles().persist(profile);
        }

        await this.#storage.set('profiles', this.profiles().toObject());

        await this.#storage.set('data', this.data().all());
    }

    public data(): IDataRepository {
        return this.#data;
    }

    public fees(): ProfileFeeService {
        return this.#fees;
    }

    public profiles(): ProfileRepository {
        return this.#profiles;
    }

    public wallets(): WalletService {
        return this.#wallets;
    }

    public reset(options?: EnvironmentOptions): void {
        this.#data = new DataRepository();
        this.#fees = new ProfileFeeService();
        this.#profiles = new ProfileRepository(this);
        this.#wallets = new WalletService();

        if (options?.storage) {
            this.#storage = options.storage as Storage;
        }
    }

    public storage(): Storage {
        return this.#storage;
    }

    private async updateVersion() {
        // For pre-evm, clear profiles, as they are not compatible.
        if (!this.data().has('version') && process.env.DELETE_OLD_PROFILES === 'true') {
            this.reset();
        }

        if (this.data().get('version') !== process.env.APP_VERSION) {
            this.data().set('version', process.env.APP_VERSION);
        }

        await this.persist();
    }
}
