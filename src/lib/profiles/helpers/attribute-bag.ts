import { get, has, set, unset } from '@/lib/helpers';

export class AttributeBag<T> {
    #attributes: Partial<T> = {} as T;

    public constructor(attributes?: Partial<T>) {
        if (attributes) {
            this.#attributes = attributes;
        }
    }

    public all(): Partial<T> {
        return this.#attributes;
    }

    public get<U = any>(key: keyof T | string, defaultValue?: U): U {
        return get(this.#attributes, key as string, defaultValue);
    }

    public set<U>(key: keyof T | string, value: U): void {
        set(this.#attributes, key as string, value);
    }

    public setMany(value: object): void {
        for (const [k, v] of Object.entries(value)) {
            this.set(k, v);
        }
    }

    public has(key: keyof T): boolean {
        return has(this.#attributes, key as string);
    }

    public hasStrict(key: keyof T | string): boolean {
        return get(this.#attributes, key as string) !== undefined;
    }

    public missing(key: keyof T): boolean {
        return !this.has(key);
    }

    public forget(key: keyof T): void {
        unset(this.#attributes, key as string);
    }

    public flush(): void {
        this.#attributes = {};
    }

    public only(keys: (keyof T)[]): Record<string, any> {
        const result: object = {};

        for (const [key, value] of Object.entries(this.#attributes)) {
            if (keys.includes(key as keyof T)) {
                result[key] = value;
            }
        }

        return result;
    }

    public except(keys: (keyof T)[]): Record<string, any> {
        const result: object = {};

        for (const [key, value] of Object.entries(this.#attributes)) {
            if (!keys.includes(key as keyof T)) {
                result[key] = value;
            }
        }

        return result;
    }
}
