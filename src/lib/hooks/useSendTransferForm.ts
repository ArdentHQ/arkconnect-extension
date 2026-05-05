import { useEffect, useState } from 'react';
import { runtime } from 'webextension-polyfill';
import { useFees } from './useFees';
import { BigNumber } from '@/lib/helpers';
import { Contracts } from '@/lib/profiles';
import {
    buildTransferData,
    handleBroadcastError,
    withAbortPromise,
} from '@/lib/utils/transactionHelpers';
import { useAppSelector } from '@/lib/store';
import { useProfileContext } from '@/lib/context/Profile';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useLedgerContext } from '@/lib/Ledger';
import { assertWallet } from '@/lib/utils/assertions';
import { precisionRound } from '@/lib/utils/precisionRound';
import { useEnvironmentContext } from '@/lib/context/Environment';
import * as SessionStore from '@/lib/store/session';
import { ApproveActionType } from '@/pages/Approve';
import { selectWallets } from '@/lib/store/wallet';
import { Network } from '@/lib/mainsail/network';
import { TransferInput } from '@/lib/mainsail/transaction.contract';
import { calculateGasFee, GasLimit } from '@/lib/hooks/useNetworkFees';
import { httpClient } from '@/lib/services';

export interface RecipientItem {
    address: string;
    alias?: string;
    amount?: string;
    isValidator?: boolean;
}

interface SendTransferForm {
    senderAddress: string;
    gasPrice: string;
    gasLimit: string;
    hasHigherCustomFee: string | null;
    hasLowerCustomFee: string | null;
    remainingBalance: number;
    amount: number;
    isSendAllSelected: string;
    network?: Network;
    recipients: RecipientItem[];
    total: number;
    mnemonic: string;
    secondMnemonic: string;
    encryptionPassword: string;
    wif: string;
    privateKey: string;
    secret: string;
    secondSecret: string;
}

type ApproveRequest = {
    session: SessionStore.Session;
    amount: string;
    receiverAddress: string;
    customGasPrice?: string;
    customGasLimit?: string;
};

const defaultState = {
    senderAddress: '',
    fees: {
        avg: 0,
    },
    gasPrice: '',
    gasLimit: '',
    hasHigherCustomFee: null,
    hasLowerCustomFee: null,
    remainingBalance: 0,
    amount: 0,
    isSendAllSelected: '',
    recipients: [],
    total: 0,
    mnemonic: '',
    secondMnemonic: '',
    encryptionPassword: '',
    wif: '',
    privateKey: '',
    secret: '',
    secondSecret: '',
};

const prepareLedger = async (wallet: Contracts.IReadWriteWallet) => {
    const signature = await wallet
        .signatory()
        .ledger(wallet.data().get<string>(Contracts.WalletData.DerivationPath)!);
    // Prevents "The device is already open" exception when running the signing function
    await wallet.ledger().disconnect();

    return {
        signatory: signature,
    };
};

export const useSendTransferForm = (
    wallet: Contracts.IReadWriteWallet,
    request: ApproveRequest,
) => {
    const { profile } = useProfileContext();
    const { onError } = useErrorHandlerContext();
    const { getGasPrices } = useFees();
    const [formValues, setFormValues] = useState<SendTransferForm>(defaultState);
    const [formValuesLoaded, setFormValuesLoaded] = useState(false);
    const { persist } = useEnvironmentContext();
    const wallets = useAppSelector(selectWallets);
    const { abortConnectionRetry } = useLedgerContext();

    const resetForm = () => {
        setFormValues(defaultState);
    };

    const submitForm = async (abortReference: AbortController) => {
        assertWallet(wallet);

        const { gasPrice, gasLimit, recipients } = formValues;

        if (wallet.isLedger()) {
            const abortSignal = abortReference.signal;
            const { signatory } = await withAbortPromise(
                abortSignal,
                abortConnectionRetry,
            )(prepareLedger(wallet));

            const data = await buildTransferData({
                recipients,
            });

            // Ensures the cache is flushed so it always fetches the latest wallet nonce
            httpClient.forgetWalletCache(wallet);

            const transactionInput: TransferInput = {
                data,
                gasLimit: BigNumber.make(gasLimit),
                gasPrice: BigNumber.make(gasPrice),
                signatory,
            };

            const uuid = await wallet.transaction().signTransfer(transactionInput);
            const response = await wallet.transaction().broadcast(uuid);

            handleBroadcastError(response);

            const transaction = wallet.transaction().transaction(uuid);

            return {
                ...transaction.toObject(),
                amount: transaction.value().toString(),
                fee: transaction.fee(),
                total: transaction.total(),
            };
        }

        const { response, error, transaction } = await runtime.sendMessage({
            type: 'SEND_TRANSACTION',
            data: {
                recipients,
                gasLimit,
                gasPrice,
            },
        });

        if (error) {
            onError(error);
            return;
        }

        handleBroadcastError(response);

        return transaction;
    };

    useEffect(() => {
        (async () => {
            try {
                if (!wallet) return;

                await profile.sync();
                await persist();

                const walletData = wallets.find((w) => w.walletId === wallet.id());

                const passphrase = walletData?.passphrase;

                const { min, avg, max } = await getGasPrices({
                    network: wallet.network().id(),
                    type: ApproveActionType.TRANSACTION,
                });

                const { customGasLimit, customGasPrice } = request;

                const hasCustomFee = !!(customGasLimit && customGasPrice);

                const defaultGasLimit = GasLimit.transfer.toString();

                const customFee = BigNumber.make(calculateGasFee(customGasPrice, customGasLimit));
                const maxFee = BigNumber.make(calculateGasFee(max.toString(), defaultGasLimit));
                const avgFee = BigNumber.make(calculateGasFee(avg.toString(), defaultGasLimit));
                const minFee = BigNumber.make(calculateGasFee(min.toString(), defaultGasLimit));

                const fee = hasCustomFee ? customFee : avgFee;

                setFormValues((prevFormValues) => ({
                    ...prevFormValues,
                    senderAddress: wallet.address(),
                    remainingBalance: Number((wallet.balance() as any)?.toNumber?.() ?? wallet.balance() ?? 0),
                    network: wallet.network(),
                    gasPrice: customGasPrice ?? avg.toString(),
                    gasLimit: customGasLimit ?? defaultGasLimit,
                    hasHigherCustomFee:
                        hasCustomFee && customFee.isGreaterThan(maxFee) ? maxFee.toString() : null,
                    hasLowerCustomFee:
                        hasCustomFee && customFee.isLessThan(minFee) ? minFee.toString() : null,
                    mnemonic: passphrase?.join(' ') || '',
                    total: BigNumber.make(fee).plus(request.amount).toHuman(),
                    recipients: [
                        {
                            address: request.receiverAddress,
                            amount: request.amount,
                        },
                    ],
                }));

                setFormValuesLoaded(true);
            } catch (error) {
                onError(error);
            }
        })();
    }, [wallet]);

    useEffect(() => {
        const remaining = BigNumber.make(formValues.remainingBalance).minus(
            calculateGasFee(formValues.gasPrice, formValues.gasLimit),
        );

        setFormValues((prevFormValues) => ({
            ...prevFormValues,
            amount: precisionRound(remaining.toNumber(), 8),
        }));
    }, [formValues.gasPrice, formValues.gasLimit]);

    return {
        formValues,
        setFormValues,
        resetForm,
        submitForm,
        values: {
            gasPrice: formValues.gasPrice,
            gasLimit: formValues.gasLimit,
            total: formValues.total,
            network: formValues.network,
            senderAddress: formValues.senderAddress,
            hasHigherCustomFee: formValues.hasHigherCustomFee,
            hasLowerCustomFee: formValues.hasLowerCustomFee,
        },
        formValuesLoaded,
    };
};
