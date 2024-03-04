import filterXSS from 'xss';

const WALLET_ALREADY_EXISTS_PATTERN =
    /The wallet \[(.*?)\] with network \[(.*?)\] already exists\./;

const DEFAULT_ERROR_TITLE = 'Something went wrong...';

const getCustomMessage = (
    errorMessage: string,
    networkMapping: { [key: string]: string },
): string | null => {
    const patterns = [
        {
            regex: WALLET_ALREADY_EXISTS_PATTERN,
            message: (wallet: string, network: string) =>
                `You have already imported the wallet <strong>${wallet}</strong> on <strong>${network}</strong>.`,
        },
    ];

    for (const { regex, message } of patterns) {
        const match = errorMessage.match(regex);
        if (match) {
            const wallet = match[1];
            const network = networkMapping[match[2]] || match[2];
            return message(filterXSS(wallet), filterXSS(network));
        }
    }

    return null;
};

export const errorTitleParser = (errorMessage: string | null): string => {
    if (!errorMessage) return DEFAULT_ERROR_TITLE;

    const pattern = WALLET_ALREADY_EXISTS_PATTERN;
    return errorMessage.match(pattern) ? 'Wallet Already Exists' : DEFAULT_ERROR_TITLE;
};

export const errorParser = (errorMessage: string): string => {
    const networkMapping: { [key: string]: string } = {
        'ark.devnet': 'Testnet',
        'ark.mainnet': 'Mainnet',
    };
    const customMessage = getCustomMessage(errorMessage, networkMapping);

    if (customMessage) return customMessage;

    const parsedMessage = errorMessage.replace(/\[(.*?)\]/g, (_, p1) => {
        if (networkMapping[p1]) {
            return `<strong>${networkMapping[p1]}</strong>`;
        }
        return `<strong>${p1}</strong>`;
    });

    return filterXSS(parsedMessage, {
        whiteList: { strong: [] },
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script'],
    });
};
