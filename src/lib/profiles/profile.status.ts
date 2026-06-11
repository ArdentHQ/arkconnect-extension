import { IProfileStatus } from './contracts.js';

export class ProfileStatus implements IProfileStatus {
    #isRestored: boolean;
    #isDirty: boolean;

    public constructor() {
        this.#isRestored = false;
        this.#isDirty = false;
    }

    public markAsDirty(): void {
        this.#isDirty = true;
    }

    public isDirty(): boolean {
        return this.#isDirty;
    }

    public markAsRestored(): void {
        this.#isRestored = true;
    }

    public isRestored(): boolean {
        return this.#isRestored;
    }

    public reset(): void {
        this.#isRestored = false;
        this.#isDirty = false;
    }

    public markAsClean(): void {
        this.#isDirty = false;
    }
}
