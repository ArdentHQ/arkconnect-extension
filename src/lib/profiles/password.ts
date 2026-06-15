import { IPasswordManager } from './contracts.js';

export class PasswordManager implements IPasswordManager {
    #password: string | undefined;

    public get(): string {
        if (this.#password === undefined) {
            throw new Error('Failed to find a password for the given profile.');
        }

        return this.#password;
    }

    public set(password: string): void {
        this.#password = password;
    }

    public exists(): boolean {
        return this.#password !== undefined;
    }

    public forget(): void {
        this.#password = undefined;
    }
}
