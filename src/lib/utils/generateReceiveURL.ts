import { URLBuilder } from '@ardenthq/arkvault-url';

export const generateReceiveUrl = ({
    coinName,
    netHash,
    address,
    amount,
}: {
    coinName: string;
    netHash: string;
    address: string;
    amount?: string;
}): string => {
    const urlBuilder = new URLBuilder();
    urlBuilder.setCoin(coinName);
    urlBuilder.setNethash(netHash);

    const url = urlBuilder.generateTransfer(address, {
        amount: amount ? Number(amount) : undefined,
    });

    return url;
};
