import { URLBuilder } from '@ardenthq/arkvault-url';

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
    const urlBuilder = new URLBuilder();
    urlBuilder.setCoin(coinName);
    urlBuilder.setNethash(netHash);

    const url = urlBuilder.generateTransfer(address, {
        memo,
        amount: amount ? Number(amount) : undefined,
    });

    return url;
};
