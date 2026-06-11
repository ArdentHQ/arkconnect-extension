import { IProfile, ISettingRepository } from './contracts.js';
import { DataRepository } from './data.repository';

export class SettingRepository implements ISettingRepository {
    readonly #profile: IProfile;
    #data: DataRepository;
    #allowedKeys: string[];

    public constructor(profile: IProfile, allowedKeys: string[]) {
        this.#profile = profile;
        this.#data = new DataRepository();
        this.#allowedKeys = allowedKeys;
    }

    public all(): object {
        return this.#data.all();
    }

    public keys(): object {
        return this.#data.keys();
    }

    public get<T>(key: string, defaultValue?: T): T | undefined {
        if (this.#isUnknownKey(key)) {
            return;
        }

        return this.#data.get(key, defaultValue);
    }

    public set(key: string, value: string | number | boolean | object): void {
        if (this.#isUnknownKey(key)) {
            return;
        }

        this.#data.set(key, value);

        this.#profile.status().markAsDirty();
    }

    public fill(entries: object): void {
        for (const [key, value] of Object.entries(entries)) {
            this.set(key, value);
        }
    }

    public has(key: string): boolean {
        if (this.#isUnknownKey(key)) {
            return false;
        }

        return this.#data.has(key);
    }

    public missing(key: string): boolean {
        return !this.has(key);
    }

    public forget(key: string): void {
        if (this.#isUnknownKey(key)) {
            return;
        }

        this.#data.forget(key);

        this.#profile.status().markAsDirty();
    }

    public flush(): void {
        this.#data.flush();

        this.#profile.status().markAsDirty();
    }

    #isUnknownKey(key: string): boolean {
        if (this.#allowedKeys.includes(key)) {
            return false;
        }

        if (this.#data.has(key)) {
            this.#data.forget(key);
        }

        return true;
    }
}
