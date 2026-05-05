import { IconDefinition } from '@/shared/components';
import Amount from '@/components/wallet/Amount';
import {
    ExtendedConfirmedTransactionData,
    ExtendedTransactionRecipient,
} from '@/lib/profiles/transaction.dto';

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
    if (transaction.isVote()) {
        return TransactionType.VOTE;
    }
    if (transaction.isUnvote()) {
        return TransactionType.UNVOTE;
    }
    if (transaction.isValidatorRegistration()) {
        return TransactionType.REGISTRATION;
    }
    if (transaction.isValidatorResignation()) {
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
                recipient.amount.plus(uniqueRecipients[existingRecipientIndex].amount);
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
    return recipients.find((recipient) => recipient.address === address)?.amount.toNumber() ?? 0;
};

export const getMultipaymentAmounts = (
    recipients: ExtendedTransactionRecipient[],
    address: string = '',
): { selfAmount: number; sentAmount: number } => {
    const selfAmount = getAmountByAddress(recipients, address);
    const sentAmount = recipients.reduce((total, recipient) => recipient.amount.plus(total).toNumber(), 0);

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
        maxDecimals={2}
        hideSmallValues
    />
);
