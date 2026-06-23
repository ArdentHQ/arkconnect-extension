import { Contracts } from '@/lib/profiles';
import { buildTransferData } from '@/lib/utils/transactionHelpers';
import { Network } from '@/lib/mainsail/network';
import { SignedMessage } from '@/lib/mainsail/message.contract';
import { BroadcastResponse as BroadcastResponseData } from '@/lib/mainsail/client.contract';
import { TransferInput, VoteInput } from '@/lib/mainsail/transaction.contract';
import { RawTransactionData } from '@/lib/mainsail/signed-transaction.dto.contract';
import { BigNumber } from '@/lib/helpers';
import { WalletToken } from '@/lib/profiles/wallet-token';

const buildSignatoryInput = (passphrase: string) => {
    return { mnemonic: passphrase };
};

interface RecipientItem {
    address: string;
    alias?: string;
    amount?: string;
    isValidator?: boolean;
}

interface BroadcastResponse {
    transaction: RawTransactionData;
    response: BroadcastResponseData;
}

export interface SendTransferInput extends TransferInput {
    recipients: RecipientItem[];
    tokenAddress?: string;
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

            await wallet.network().sync();

            const passphrase = await wallet.confirmKey().get(wallet.profile().password().get());
            const signatory = await wallet
                .signatoryFactory()
                .make(buildSignatoryInput(passphrase));

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
            await wallet.network().sync();

            const passphrase = await wallet.confirmKey().get(wallet.profile().password().get());
            const signatory = await wallet
                .signatoryFactory()
                .make(buildSignatoryInput(passphrase));

            let token: WalletToken | undefined;

            if (input.tokenAddress) {
                token = wallet.tokens().findByTokenAddress(input.tokenAddress);

                if (!token) {
                    const collection = await wallet.client().tokenAddresses({
                        addresses: [wallet.address()],
                        minBalance: '0',
                    });

                    token = collection
                        .items()
                        .find((item) => item.token().address() === input.tokenAddress);

                    if (token) {
                        wallet.tokens().push(token);
                    }
                }

                if (!token) {
                    throw new Error(
                        `[sendTransfer] Token ${input.tokenAddress} not found for wallet ${wallet.address()}`,
                    );
                }
            }

            const isTokenTransfer = !!token;

            const transactionInput = {
                data: await buildTransferData({
                    isMultiSignature: false,
                    recipients: input.recipients,
                    preserveAmountPrecision: isTokenTransfer,
                }),
                gasPrice: input.gasPrice ? BigNumber.make(input.gasPrice) : undefined,
                gasLimit: input.gasLimit ? BigNumber.make(input.gasLimit) : undefined,
                signatory,
                token,
            };

            const uuid = isTokenTransfer
                ? await wallet.transaction().signTransferToken(transactionInput)
                : await wallet.transaction().signTransfer(transactionInput);
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
