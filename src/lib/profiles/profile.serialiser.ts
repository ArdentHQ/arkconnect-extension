import { IProfile, IProfileData, IProfileExportOptions } from './contracts.js';

export class ProfileSerialiser {
    readonly #profile: IProfile;

    public constructor(profile: IProfile) {
        this.#profile = profile;
    }

    public toJSON(
        options: IProfileExportOptions = {
            addNetworkInformation: true,
            excludeEmptyWallets: false,
            excludeLedgerWallets: false,
            saveGeneralSettings: true,
        },
    ): IProfileData {
        if (!options.saveGeneralSettings) {
            throw new Error('This is not implemented yet');
        }

        return {
            data: this.#profile.data().all(),
            hosts: this.#profile.hosts().all(),
            id: this.#profile.id(),
            settings: this.#profile.settings().all(),
            wallets: this.#profile.wallets().toObject(options),
        };
    }
}
