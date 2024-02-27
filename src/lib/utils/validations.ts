import browser from 'webextension-polyfill';

export const isValidPassword = async (password: string) => {
    const { isValid } = await browser.runtime.sendMessage({
        type: 'VALIDATE_PASSWORD',
        data: { password },
    });

    return isValid;
};
