import constants from '@/constants';

export const generateReceiveUrl = ({
    coinName,
    netHash,
    address,
    amount,
    memo,
}: {
    coinName: string;
    netHash: string;
    address: string;
    amount?: string;
    memo?: string;
}): string => {
    let url = `${constants.ARKVAULT_BASE_URL}/?coin=${coinName}&nethash=${netHash}&method=transfer&recipient=${address}`;

    if (amount) {
        url += `&amount=${amount}`;
    }

    if (memo) {
        url += `&memo=${memo}`;
    }

    return url;
};