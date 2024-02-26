import { Contracts } from '@ardenthq/sdk-profiles';
import { Contracts as SDKContracts } from '@ardenthq/sdk';
import { Services } from '@ardenthq/sdk';
import { buildTransferData } from '../utils/transactionHelpers';

export interface RecipientItem {
  address: string;
  alias?: string;
  amount?: number;
  isDelegate?: boolean;
}

export interface BroadcastResponse {
  transaction: SDKContracts.RawTransactionData;
  response: Services.BroadcastResponse;
}

export interface SendTransferInput extends Services.TransferInput {
  recipients: RecipientItem[];
}

function BroadcastResponse({
  uuid,
  response,
  wallet,
}: {
  uuid: string;
  response: Services.BroadcastResponse;
  wallet: Contracts.IReadWriteWallet;
}) {
  return {
    async toData() {
      const transaction = wallet.transaction().transaction(uuid);

      return {
        response,
        transaction: {
          ...transaction.toObject(),
          amount: transaction.amount().toString(),
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
     * @param {Services.VoteInput} input
     * @returns {Promise<BroadcastResponse>}
     */
    async sendVote(input: Services.VoteInput): Promise<BroadcastResponse> {
      // @TODO: validate input.

      await wallet.synchroniser().coin();

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
      await wallet.synchroniser().coin();

      const signatory = await wallet.signatoryFactory().make({
        mnemonic: await wallet.confirmKey().get(wallet.profile().password().get()),
      });

      const transactionInput = {
        data: await buildTransferData({
          coin: wallet.coin(),
          isMultiSignature: signatory.actsWithMultiSignature() || signatory.hasMultiSignature(),
          recipients: input.recipients,
        }),
        fee: input.fee,
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
     * @returns {Promise<Services.SignedMessage>}
     */
    async signMessage(message: string): Promise<Services.SignedMessage> {
      await wallet.synchroniser().coin();

      const mnemonic = await wallet.confirmKey().get(wallet.profile().password().get());

      return await wallet.message().sign({
        message,
        signatory: await wallet.signatory().mnemonic(mnemonic),
      });
    },
  };
}
