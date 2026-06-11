import { UUID } from '@ardenthq/arkvault-crypto';

import { IProfile, IProfileExportOptions, IProfileInput } from './contracts.js';
import { DataRepository } from './data.repository';
import { ProfileDumper } from './profile.dumper';
import { ProfileExporter } from './profile.exporter';
import { ProfileImporter } from './profile.importer';
import { Profile } from './profile.js';
import { Environment } from './environment.js';

export class ProfileRepository {
    readonly #data: DataRepository;
    readonly #env: Environment;

    public constructor(env: Environment) {
        this.#data = new DataRepository();
        this.#env = env;
    }

    public fill(profiles: object): void {
        for (const [id, profile] of Object.entries(profiles)) {
            this.#data.set(id, new Profile(profile, this.#env));
        }
    }

    public all(): Record<string, IProfile> {
        return this.#data.all() as Record<string, IProfile>;
    }

    public first(): IProfile {
        return this.#data.first();
    }

    public last(): IProfile {
        return this.#data.last();
    }

    public keys(): string[] {
        return this.#data.keys();
    }

    public values(): IProfile[] {
        return this.#data.values();
    }

    public findById(id: string): IProfile {
        if (this.#data.missing(id)) {
            throw new Error(`No profile found for [${id}].`);
        }

        return this.#data.get(id) as IProfile;
    }

    public findByName(name: string): IProfile | undefined {
        return this.values().find(
            (profile: IProfile) => profile.name().toLowerCase() === name.toLowerCase(),
        );
    }

    public push(profile: IProfile): void {
        this.#data.set(profile.id(), profile);
    }

    public async create(name: string): Promise<IProfile> {
        if (this.findByName(name)) {
            throw new Error(`The profile [${name}] already exists.`);
        }

        const result = new Profile({ data: '', id: UUID.random(), name }, this.#env);

        this.push(result);

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

    public has(id: string): boolean {
        return this.#data.has(id);
    }

    public forget(id: string): void {
        if (this.#data.missing(id)) {
            throw new Error(`No profile found for [${id}].`);
        }

        this.#data.forget(id);
    }

    public flush(): void {
        this.#data.flush();
    }

    public count(): number {
        return this.#data.count();
    }

    public toObject(): Record<string, object> {
        const result: Record<string, object> = {};
        const profiles: [string, Profile][] = Object.entries(this.#data.all());

        for (const [id, profile] of profiles) {
            result[id] = new ProfileDumper(profile).dump();
        }

        return result;
    }
}
