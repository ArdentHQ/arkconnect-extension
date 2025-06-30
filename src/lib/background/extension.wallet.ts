import { Contracts } from '@/lib/profiles';
import { buildTransferData } from '@/lib/utils/transactionHelpers';
import { Network } from '@/lib/mainsail/network';
import { SignedMessage } from '@/lib/mainsail/message.contract';
import { BroadcastResponse as BroadcastResponseData } from '@/lib/mainsail/client.contract';
import { TransferInput, VoteInput } from '@/lib/mainsail/transaction.contract';
import { RawTransactionData } from '@/lib/mainsail/signed-transaction.dto.contract';

interface RecipientItem {
    address: string;
    alias?: string;
    amount?: string;
    isDelegate?: boolean;
}

interface BroadcastResponse {
    transaction: RawTransactionData;
    response: BroadcastResponseData;
}

export interface SendTransferInput extends TransferInput {
    recipients: RecipientItem[];
    memo?: string;
}

function BroadcastResponse({
    uuid,
    response,
    wallet,
}: {
    uuid: string;
    response: BroadcastResponseData;
    wallet: Contracts.IReadWriteWallet;
}) {
    return {
        async toData() {
            const transaction = wallet.transaction().transaction(uuid);

            return {
                response,
                transaction: {
                    ...transaction.toObject(),
                    amount: transaction.value().toString(),
                    total: transaction.total().toString(),
                    fee: transaction.fee().toString(),
                },
            };
        },
    };
}

export function Wallet({ wallet }: { wallet: Contracts.IReadWriteWallet }) {
    return {
        /**
         * Signs & broadcasts a vote transaction. Can be vote, unvote or swap .
         *
         * @param {VoteInput} input
         * @returns {Promise<BroadcastResponse>}
         */
        async sendVote(input: VoteInput): Promise<BroadcastResponse> {
            // @TODO: validate input.

            // TODO: enable sync if needed
            // await wallet.synchroniser().coin();

            const signatory = await wallet.signatoryFactory().make({
                mnemonic: await wallet.confirmKey().get(wallet.profile().password().get()),
            });

            const uuid = await wallet.transaction().signVote({
                ...input,
                signatory,
            });

            const response = await wallet.transaction().broadcast(uuid);

            return await BroadcastResponse({ uuid, wallet, response }).toData();
        },
        /**
         * Signs and broadacts a transfer transaction (single or multiplayment).
         *
         * @param {SendTransferInput} input
         * @returns {Promise<BroadcastResponse>}
         */
        async sendTransfer(input: SendTransferInput): Promise<BroadcastResponse> {
            // await wallet.synchroniser().coin();

            const signatory = await wallet.signatoryFactory().make({
                mnemonic: await wallet.confirmKey().get(wallet.profile().password().get()),
            });

            const transactionInput = {
                data: await buildTransferData({
                    memo: input.memo,
                    isMultiSignature: false,
                    recipients: input.recipients,
                }),
                gasPrice: input.gasPrice,
                gasLimit: input.gasLimit,
                signatory,
            };

            const uuid = await wallet.transaction().signTransfer(transactionInput);
            const response = await wallet.transaction().broadcast(uuid);

            return await BroadcastResponse({ uuid, wallet, response }).toData();
        },
        /**
         * Signs a given message.
         *
         * @param {string} message
         * @returns {Promise<SignedMessage>}
         */
        async signMessage(message: string): Promise<SignedMessage> {
            // await wallet.synchroniser().coin();

            const mnemonic = await wallet.confirmKey().get(wallet.profile().password().get());

            return await wallet.message().sign({
                message,
                signatory: await wallet.signatory().mnemonic(mnemonic),
            });
        },
        /**
         * Returns the address for the wallet.
         *
         * @returns {string}
         */
        address(): string {
            return wallet.address();
        },
        /**
         * Returns the network of a wallet.
         *
         * @returns {Network}
         */
        network(): Network {
            return wallet.network();
        },
    };
}
