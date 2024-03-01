import { runtime } from 'webextension-polyfill';

export const isValidPassword = async (password: string) => {
    const { isValid } = await runtime.sendMessage({
        type: 'VALIDATE_PASSWORD',
        data: { password },
    });

    return isValid;
};
