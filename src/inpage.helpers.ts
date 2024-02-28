export const getLogoOrFaviconUrl = () => {
    let iconUrl = undefined;

    // First, try searching for a logo in image tags.
    const imageTags = document.getElementsByTagName('img');
    for (let i = 0; i < imageTags.length; i++) {
        if (imageTags[i].src?.toLowerCase().includes('logo')) {
            iconUrl = imageTags[i].src;
            break; // Stop searching if a logo is found.
        }
    }

    // If no logo is found, try searching for a favicon in 'link' elements.
    if (!iconUrl) {
        const nodeList = document.getElementsByTagName('link');
        for (let i = 0; i < nodeList.length; i++) {
            const rel = nodeList[i].getAttribute('rel');
            const href = nodeList[i].getAttribute('href');
            if (rel === 'icon' || rel === 'shortcut icon' || href?.includes('favicon')) {
                iconUrl = href;
                break; // Stop searching if a favicon is found.
            }
        }
    }

    if (iconUrl) {
        return iconUrl.startsWith('http') ? iconUrl : window.location.origin + iconUrl;
    }

    return null; // Return null if neither a logo nor a favicon is found.
};

export const isValidObjectByType = <T>(object: any, type: T): object is T => {
    for (const key in type) {
        if (typeof object[key] === 'object') {
            return isValidObjectByType(object[key], type[key]);
        }

        if (!(key in object) || typeof object[key] !== typeof type[key]) {
            return false;
        }
    }

    return true;
};

export const assertPositiveNonZero = (amount: unknown, maxDecimals: number = 8) => {
    if (typeof amount !== 'number') {
        throw new Error(`Expected 'amount' to be a number, but received ${amount}`);
    }

    if (amount <= 0) {
        throw new Error(
            `Expected 'amount' to be a positive number greater than 0, but received ${amount}`,
        );
    }

    const amountStr = amount.toString();
    const decimalIndex = amountStr.indexOf('.');

    if (decimalIndex !== -1) {
        const decimals = amountStr.length - decimalIndex - 1;
        if (decimals > maxDecimals) {
            throw new Error(
                `Expected 'amount' to have no more than ${maxDecimals} decimal places, but received ${amount}`,
            );
        }
    }
};
