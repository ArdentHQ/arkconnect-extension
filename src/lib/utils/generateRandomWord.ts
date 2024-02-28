const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const generateRandomWord = (length: number): string => {
    let randomWord = '';
    const randomValues = new Uint8Array(length);

    // Use the Web Crypto API to generate cryptographically secure random values
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
        const randomIndex = randomValues[i] % characters.length;
        randomWord += characters.charAt(randomIndex);
    }

    return randomWord;
};
