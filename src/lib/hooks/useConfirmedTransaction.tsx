import { useEffect, useState } from 'react';
import { IReadWriteWallet } from '@/lib/profiles/wallet.contract';

export const useConfirmedTransaction = ({
    wallet,
    transactionId,
}: {
    wallet: IReadWriteWallet;
    transactionId: string;
}) => {
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        const checkConfirmed = async () => {
            const id = setInterval(async () => {
                try {
                    await wallet.client().transaction(transactionId);
                    setIsConfirmed(true);
                    clearInterval(id);
                } catch (_e) {
                    // transaction is not forged yet, ignore the error
                }
            }, 1000);
        };

        void checkConfirmed();
    }, [wallet.id(), transactionId]);

    return isConfirmed;
};
