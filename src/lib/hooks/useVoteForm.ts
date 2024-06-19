import { Networks, Services } from '@ardenthq/sdk';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useEffect, useState } from 'react';
import { runtime } from 'webextension-polyfill';
import { useFees } from './useFees';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { precisionRound } from '@/lib/utils/precisionRound';
import { handleBroadcastError, withAbortPromise } from '@/lib/utils/transactionHelpers';
import { useAppSelector } from '@/lib/store';
import { useProfileContext } from '@/lib/context/Profile';
import { useErrorHandlerContext } from '@/lib/context/ErrorHandler';
import { useLedgerContext } from '@/lib/Ledger';
import { ApproveActionType } from '@/pages/Approve';
import * as WalletStore from '@/lib/store/wallet';
import * as SessionStore from '@/lib/store/session';

interface SendVoteForm {
    senderAddress: string;
    fee: number;
    hasHigherCustomFee: number | null;
    hasLowerCustomFee: number | null;
    remainingBalance: number;
    amount: number;
    network?: Networks.Network;
    vote: Contracts.VoteRegistryItem | null;
    unvote: Contracts.VoteRegistryItem | null;
    customFee?: number;
}

type VoteDelegateProperties = {
    address: string;
    amount: number;
};

type ApproveVoteRequest = {
    domain: string;
    session: SessionStore.Session;
    vote: VoteDelegateProperties;
    unvote: VoteDelegateProperties;
    tabId: number;
    customFee?: number;
};

const defaultState = {
    senderAddress: '',
    fee: 0,
    remainingBalance: 0,
    hasHigherCustomFee: null,
    hasLowerCustomFee: null,
    amount: 0,
    vote: null,
    unvote: null,
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

export const useVoteForm = (wallet: Contracts.IReadWriteWallet, request: ApproveVoteRequest) => {
    const { env } = useEnvironmentContext();
    const { profile } = useProfileContext();
    const { onError } = useErrorHandlerContext();
    const { calculateAvgFee, calculateMaxFee, calculateMinFee } = useFees();
    const [loading, setLoading] = useState(true);
    const [formValues, setFormValues] = useState<SendVoteForm>(defaultState);
    const { persist } = useEnvironmentContext();
    const wallets = useAppSelector(WalletStore.selectWallets);
    const { abortConnectionRetry } = useLedgerContext();

    const resetForm = () => {
        setFormValues(defaultState);
    };

    const submitForm = async (abortReference: AbortController) => {
        const { fee, vote, unvote } = formValues;

        const data = {
            fee: +fee,
            data: {
                unvotes: unvote && [
                    {
                        amount: unvote.amount,
                        id: unvote.wallet?.governanceIdentifier(),
                    },
                ],
                votes: vote && [
                    {
                        amount: vote.amount,
                        id: vote.wallet?.governanceIdentifier(),
                    },
                ],
            },
        };

        if (wallet.isLedger()) {
            const abortSignal = abortReference.signal;
            const { signatory } = await withAbortPromise(
                abortSignal,
                abortConnectionRetry,
            )(prepareLedger(wallet));

            const voteTransactionInput: Services.TransactionInputs = {
                ...data,
                signatory,
            };

            // @ts-expect-error data is already there
            const uuid = await wallet.transaction().signVote(voteTransactionInput);
            const response = await wallet.transaction().broadcast(uuid);

            handleBroadcastError(response);

            const transaction = wallet.transaction().transaction(uuid);

            return {
                ...transaction.toObject(),
                amount: transaction.amount().toString(),
                fee: transaction.fee(),
                total: transaction.total(),
            };
        }

        const { transaction, response, error } = await runtime.sendMessage({
            type: 'SEND_VOTE',
            data,
        });

        if (error) {
            throw new Error(error);
        }

        handleBroadcastError(response);

        return transaction;
    };

    const getVote = async () => {
        try {
            env.delegates().all(wallet.network().coin(), wallet.network().id());
        } catch {
            await env.delegates().sync(profile, wallet.network().coin(), wallet.network().id());
        }
        const vote = request.vote && {
            amount: request.vote?.amount,
            wallet: env
                .delegates()
                .findByAddress(
                    wallet.network().coin(),
                    wallet.network().id(),
                    request.vote?.address,
                ),
        };
        const unvote = request.unvote && {
            amount: request.unvote?.amount,
            wallet: env
                .delegates()
                .findByAddress(
                    wallet.network().coin(),
                    wallet.network().id(),
                    request.unvote?.address,
                ),
        };
        return { vote, unvote };
    };

    useEffect(() => {
        (async () => {
            if (!wallet.id() || !wallets.some((w) => w.walletId === wallet.id())) {
                return;
            }

            try {
                await profile.sync();
                await persist();

                const averageFee = await calculateAvgFee({
                    coin: wallet.network().coin(),
                    network: wallet.network().id(),
                    type: ApproveActionType.VOTE,
                });

                const maxFee = await calculateMaxFee({
                    coin: wallet.network().coin(),
                    network: wallet.network().id(),
                    type: ApproveActionType.VOTE,
                });

                const minFee = await calculateMinFee({
                    coin: wallet.network().coin(),
                    network: wallet.network().id(),
                    type: ApproveActionType.VOTE,
                });

                const fee = request.customFee ?? averageFee;

                const { vote, unvote } = await getVote();

                setFormValues((prevFormValues) => ({
                    ...prevFormValues,
                    senderAddress: wallet.address(),
                    remainingBalance: wallet.balance(),
                    fee,
                    hasHigherCustomFee:
                        request.customFee && request.customFee > maxFee ? maxFee : null,
                    hasLowerCustomFee:
                        request.customFee && request.customFee < minFee ? minFee : null,
                    vote: vote,
                    unvote: unvote,
                }));
            } catch (error: any) {
                onError(error);
                runtime.sendMessage({
                    type: 'SIGN_VOTE_REJECT',
                    data: {
                        domain: request.domain,
                        status: 'failed',
                        message: error.message,
                        tabId: request.tabId,
                    },
                });
            } finally {
                setLoading(false);
            }
        })();
    }, [wallet]);

    useEffect(() => {
        const remaining = formValues.remainingBalance - formValues.fee;

        setFormValues((prevFormValues) => ({
            ...prevFormValues,
            amount: precisionRound(remaining, 8),
        }));
    }, [formValues.fee]);

    return {
        formValues,
        setFormValues,
        resetForm,
        submitForm,
        loading,
        values: {
            fee: formValues.fee,
            vote: formValues.vote,
            unvote: formValues.unvote,
            hasHigherCustomFee: formValues.hasHigherCustomFee,
            hasLowerCustomFee: formValues.hasLowerCustomFee,
        },
    };
};
