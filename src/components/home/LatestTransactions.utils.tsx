import {
    ExtendedConfirmedTransactionData,
    ExtendedTransactionRecipient,
} from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
import { IconDefinition } from '@/shared/components';
import Amount from '@/components/wallet/Amount';

export enum TransactionType {
    SEND = 'send',
    RECEIVE = 'receive',
    RETURN = 'return',
    SWAP = 'swap',
    VOTE = 'vote',
    UNVOTE = 'unvote',
    SECOND_SIGNATURE = 'second-signature',
    MULTISIGNATURE = 'multisignature',
    REGISTRATION = 'registration',
    RESIGNATION = 'resignation',
    OTHER = 'other',
    MULTIPAYMENT = 'multipayment',
}

export const getType = (transaction: ExtendedConfirmedTransactionData): string => {
    if (transaction.isMultiPayment()) {
        return TransactionType.MULTIPAYMENT;
    }
    if (transaction.isTransfer()) {
        if (transaction.isReturn()) {
            return TransactionType.RETURN;
        } else if (transaction.isSent()) {
            return TransactionType.SEND;
        } else if (transaction.isReceived()) {
            return TransactionType.RECEIVE;
        }
    }
    if (transaction.isVoteCombination()) {
        return TransactionType.SWAP;
    }
    if (transaction.isVote()) {
        return TransactionType.VOTE;
    }
    if (transaction.isUnvote()) {
        return TransactionType.UNVOTE;
    }
    if (transaction.isSecondSignature()) {
        return TransactionType.SECOND_SIGNATURE;
    }
    if (transaction.isMultiSignatureRegistration()) {
        return TransactionType.MULTISIGNATURE;
    }
    if (transaction.isDelegateRegistration()) {
        return TransactionType.REGISTRATION;
    }
    if (transaction.isDelegateResignation()) {
        return TransactionType.RESIGNATION;
    }
    return TransactionType.OTHER;
};

export const getUniqueRecipients = (
    transaction: ExtendedConfirmedTransactionData,
): ExtendedTransactionRecipient[] => {
    const uniqueRecipients: ExtendedTransactionRecipient[] = [];

    transaction.recipients().forEach((recipient) => {
        const existingRecipientIndex = uniqueRecipients.findIndex(
            (r) => r.address === recipient.address,
        );
        if (existingRecipientIndex !== -1) {
            uniqueRecipients[existingRecipientIndex].amount =
                uniqueRecipients[existingRecipientIndex].amount + recipient.amount;
        } else {
            uniqueRecipients.push({ address: recipient.address, amount: recipient.amount });
        }
    });

    return uniqueRecipients;
};

export const getAmountByAddress = (
    recipients: ExtendedTransactionRecipient[],
    address?: string,
): number => {
    return recipients.find((recipient) => recipient.address === address)?.amount ?? 0;
};

export const getMultipaymentAmounts = (
    recipients: ExtendedTransactionRecipient[],
    address: string = '',
): { selfAmount: number; sentAmount: number } => {
    const selfAmount = getAmountByAddress(recipients, address);
    const sentAmount = recipients.reduce((total, recipient) => total + recipient.amount, 0);

    return { selfAmount, sentAmount: sentAmount - selfAmount };
};

export const getTransactionIcon = (
    transaction: ExtendedConfirmedTransactionData,
): IconDefinition => {
    const type = getType(transaction);

    if (type === TransactionType.MULTIPAYMENT) {
        return transaction.isSent() ? 'send' : 'receive';
    }

    return type as IconDefinition;
};

export const renderAmount = ({
    value,
    isNegative,
    showSign,
    primaryCurrency,
    displayTooltip = true,
}: {
    value: number;
    isNegative: boolean;
    showSign: boolean;
    primaryCurrency: string;
    displayTooltip?: boolean;
}) => (
    <Amount
        value={value}
        ticker={primaryCurrency}
        tooltipPlacement='bottom-end'
        withTicker
        showSign={showSign}
        isNegative={isNegative}
        maxDigits={20}
        displayTooltip={displayTooltip}
    />
);
