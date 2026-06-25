import { Exceptions, Networks } from '@/lib/mainsail';
import { BigNumber } from '@/lib/helpers';

import { Hex } from 'viem';
import { ContractAddresses, TransactionDataEncoder } from '@arkecosystem/typescript-crypto';
import { IProfile } from '@/lib/profiles/contracts';
import { assertToken } from '@/utils/assertions';

interface RecipientPaymentItem {
    address: string;
    amount: number;
}

export type EncodeTransactionType = 'transfer' | 'vote';

export interface EncodeInputData {
    senderAddress: string;
    recipientAddress?: string;
    recipients?: RecipientPaymentItem[];
    voteAddresses?: string[];
    tokenContractAddress?: string;
}

interface EncodedData {
    to: (typeof ContractAddresses)[keyof typeof ContractAddresses] | string;
    data?: Hex;
}

export class TransactionEncoder {
    #network: Networks.Network;
    #profile: IProfile;

    constructor(profile: IProfile, network: Networks.Network) {
        this.#profile = profile;
        this.#network = network;
    }

    public transfer(to: string): EncodedData {
        return {
            data: undefined,
            to,
        };
    }

    public tokenTransfer(tokenContractAddress: string, inputData: EncodeInputData): EncodedData {
        const token = this.#profile
            .tokens()
            .selected()
            .items()
            .find((token) => token.token().address() === inputData.tokenContractAddress);

        assertToken(token);
        const recipient = inputData.recipients?.at(0);
        const amount = BigNumber.make(recipient?.amount ?? 0, token.token().decimals()).toSatoshi();

        return {
            data: TransactionDataEncoder.tokenTransfer(recipient?.address!, amount.toFixed(0)),
            to: tokenContractAddress,
        };
    }

    public vote(voteAddresses: string[]): EncodedData {
        const vote = voteAddresses.at(0);
        const isVote = !!vote;

        if (isVote) {
            return {
                data: TransactionDataEncoder.vote(vote),
                to: ContractAddresses.CONSENSUS,
            };
        }

        return {
            data: TransactionDataEncoder.unvote(),
            to: ContractAddresses.CONSENSUS,
        };
    }

    byType(inputData: EncodeInputData, type: EncodeTransactionType): EncodedData {
        if (type === 'transfer' && !!inputData.tokenContractAddress && inputData.recipientAddress) {
            const hasToken = this.#profile
                .tokens()
                .selected()
                .items()
                .some((token) => token.token().address() === inputData.tokenContractAddress);

            if (!hasToken) {
                return this.transfer(inputData.recipientAddress);
            }

            return this.tokenTransfer(inputData.tokenContractAddress, inputData);
        }

        if (type === 'transfer' && inputData.recipientAddress) {
            return this.transfer(inputData.recipientAddress);
        }

        if (type === 'vote' && !!inputData.voteAddresses) {
            return this.vote(inputData.voteAddresses);
        }

        throw new Exceptions.Exception(
            `[TransactionEncoder#byType] Unknown transaction type: ${type} or missing input data: ${JSON.stringify(inputData)}]`,
        );
    }
}
