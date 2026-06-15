import { Services, Signatories } from '@/lib/mainsail';

import { ExtendedSignedTransactionData } from './signed-transaction.dto.js';

export type SignedTransactionDataDictionary = Record<string, ExtendedSignedTransactionData>;

export interface ITransactionService {
    sync(): Promise<void>;

    addSignature(id: string, signatory: Signatories.Signatory): Promise<Services.BroadcastResponse>;

    signTransferToken(input: Services.TransferInput): Promise<string>;

    signTransfer(input: Services.TransferInput): Promise<string>;

    signDelegateRegistration(input: Services.ValidatorResignationInput): Promise<string>;

    signValidatorRegistration(input: Services.ValidatorRegistrationInput): Promise<string>;

    signUpdateValidator(input: Services.UpdateValidatorInput): Promise<string>;

    signUsernameRegistration(input: Services.UsernameRegistrationInput): Promise<string>;

    signUsernameResignation(input: Services.UsernameResignationInput): Promise<string>;

    signContractDeployment(input: Services.ContractDeploymentInput): Promise<string>;

    signVote(input: Services.VoteInput): Promise<string>;

    signMultiPayment(input: Services.MultiPaymentInput): Promise<string>;

    signDelegateResignation(input: Services.ValidatorResignationInput): Promise<string>;

    signValidatorResignation(input: Services.ValidatorResignationInput): Promise<string>;

    transaction(id: string): ExtendedSignedTransactionData;

    pending(): SignedTransactionDataDictionary;

    signed(): SignedTransactionDataDictionary;

    broadcasted(): SignedTransactionDataDictionary;

    hasBeenSigned(id: string): boolean;

    hasBeenBroadcasted(id: string): boolean;

    hasBeenConfirmed(id: string): boolean;

    isAwaitingConfirmation(id: string): boolean;

    canBeSigned(id: string): boolean;

    canBeBroadcasted(id: string): boolean;

    broadcast(id: string): Promise<Services.BroadcastResponse>;

    confirm(id: string): Promise<boolean>;

    dump(): void;

    restore(): void;
}
