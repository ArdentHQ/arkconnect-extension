export interface IProfileStatus {
    markAsDirty(): void;

    isDirty(): boolean;

    markAsRestored(): void;

    isRestored(): boolean;

    reset(): void;

    markAsClean(): void;
}
