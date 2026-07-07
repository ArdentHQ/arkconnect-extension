import { UUID } from '@ardenthq/arkvault-crypto';

import { IProfile, IProfileExportOptions, IProfileInput } from './contracts.js';
import { ProfileDumper } from './profile.dumper';
import { ProfileExporter } from './profile.exporter';
import { ProfileImporter } from './profile.importer';
import { Profile } from './profile.js';
import { Environment } from './environment.js';

export class ProfileRepository {
    #profile: IProfile | undefined;
    readonly #env: Environment;

    public constructor(env: Environment) {
        this.#profile = undefined;
        this.#env = env;
    }

    public fill(profiles: object): void {
        const entries = Object.entries(profiles);

        if (entries.length === 0) {
            return;
        }

        if (entries.length > 1) {
            throw new Error('Expected at most one profile in storage.');
        }

        const [, profile] = entries[0];

        this.#profile = new Profile(profile, this.#env);
    }

    public first(): IProfile {
        return this.#profile as IProfile;
    }

    public push(profile: IProfile): void {
        this.#profile = profile;
    }

    public async create(name: string): Promise<IProfile> {
        const result = await this.createDetached(name);

        this.push(result);

        return result;
    }

    /**
     * Builds and persists a new profile without making it the active profile.
     * Useful for callers that need a throwaway profile (e.g. an empty
     * exportable placeholder) without disturbing the currently active one.
     */
    public async createDetached(name: string): Promise<IProfile> {
        const result = new Profile({ data: '', id: UUID.random(), name }, this.#env);

        result.initialise(name);

        result.status().markAsRestored();

        await this.persist(result);

        return result;
    }

    public async import(data: string, password?: string): Promise<Profile> {
        const result = new Profile(
            {
                data,
                id: UUID.random(),
                name: '',
                password,
            },
            this.#env,
        );

        // Ignoring details (`ignoreDetails`) for now. At this point, the
        // ProfileImporter only needs the profile name and some settings to populate
        // the form.
        // It will run again in the `restore` method, where it would fill the rest
        // of the data.
        // This helps avoid issues like duplicated data—for example, this can happen
        // when migrating a contact that has two addresses.
        await new ProfileImporter(result, this.#env).ignoreDetails().import(password);

        return result;
    }

    public async export(
        profile: IProfile,
        options: IProfileExportOptions = {
            addNetworkInformation: true,
            excludeEmptyWallets: false,
            excludeLedgerWallets: false,
            saveGeneralSettings: true,
        },
        password?: string,
    ): Promise<string> {
        return new ProfileExporter(profile).export(password, options);
    }

    public async restore(profile: IProfile, password?: string): Promise<void> {
        await new ProfileImporter(profile, this.#env).import(password);

        if (profile.wallets().selected().length === 0) {
            profile.wallets().selectOne(profile.wallets().first());
        }

        profile.status().markAsRestored();
    }

    public dump(profile: IProfile): IProfileInput {
        return new ProfileDumper(profile).dump();
    }

    public async persist(profile: IProfile): Promise<void> {
        if (!profile.status().isRestored()) {
            return;
        }

        if (!profile.status().isDirty()) {
            return;
        }

        if (profile.usesPassword() && profile.password().exists()) {
            profile
                .getAttributes()
                .set('data', await new ProfileExporter(profile).export(profile.password().get()));
        }

        if (!profile.usesPassword()) {
            profile.getAttributes().set('data', await new ProfileExporter(profile).export());
        }

        profile.status().markAsClean();
    }

    public forget(id: string): void {
        if (this.#profile === undefined || this.#profile.id() !== id) {
            throw new Error(`No profile found for [${id}].`);
        }

        this.#profile = undefined;
    }

    public flush(): void {
        this.#profile = undefined;
    }

    public toObject(): Record<string, object> {
        if (this.#profile === undefined) {
            return {};
        }

        return { [this.#profile.id()]: new ProfileDumper(this.#profile).dump() };
    }
}
