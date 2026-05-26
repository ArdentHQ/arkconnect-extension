export const toasts = {
    dismiss: (_id?: unknown) => undefined,
    error: (_message: string) => 'toast-error',
    info: (_message: string) => 'toast-info',
    isActive: (_id?: unknown) => false,
    success: (_message: string) => 'toast-success',
    update: (_id: unknown, _type: string, _content: string) => undefined,
    warning: (_message: string) => 'toast-warning',
};
