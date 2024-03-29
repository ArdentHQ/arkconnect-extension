import { runtime } from 'webextension-polyfill';
import { Storage } from '@ardenthq/sdk-profiles';

export class ExtensionClientStorage implements Storage {
    private storage: any;

    public constructor(data?: any) {
        this.storage = data || {};
    }

    public async all<T = Record<string, unknown>>(): Promise<T> {
        return this.storage;
    }

    public async get<T = any>(key: string): Promise<T | undefined> {
        return this.storage[key] as T;
    }

    public async set(key: string, value: string | object): Promise<void> {
        if (key === 'profiles') {
            const { profileDump } = await runtime.sendMessage({
                type: 'PERSIST',
                data: { profileDump: value },
            });

            this.storage[key] = {
                [profileDump.id]: profileDump,
            };
            return;
        }

        if (key === 'data') {
            await runtime.sendMessage({
                type: 'PERSIST_ENV_DATA',
                data: value,
            });
        }

        this.storage[key] = value;
    }

    public async has(key: string): Promise<boolean> {
        return Object.keys(this.storage).includes(key);
    }

    public async forget(key: string): Promise<void> {
        delete this.storage[key];
    }

    public async flush(): Promise<void> {
        this.storage = {};
    }

    public async count(): Promise<number> {
        return 0;
    }

    public async snapshot(): Promise<void> {
        //
    }

    public async restore(): Promise<void> {
        //
    }
}
