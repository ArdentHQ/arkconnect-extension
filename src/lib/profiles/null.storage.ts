/* eslint-disable */
import { Storage } from './environment.models.js';

export class NullStorage implements Storage {
    public async all<T = Record<string, unknown>>(): Promise<T> {
        return {} as T;
    }

    public async get<T = any>(_key: string): Promise<T | undefined> {
        return undefined;
    }

    public async set(_key: string, _value: string): Promise<void> {
        //
    }

    public async has(_key: string): Promise<boolean> {
        return false;
    }

    public async forget(_key: string): Promise<void> {
        //
    }

    public async flush(): Promise<void> {
        //
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
