import { IReadWriteWallet } from '@ardenthq/sdk-profiles/distribution/esm/wallet.contract';
import { ConfirmedTransactionData, MultiPaymentRecipient } from '@ardenthq/sdk/distribution/esm/confirmed-transaction.dto.contract';
import { useTranslation } from 'react-i18next';
import { useDelegateInfo } from '@/lib/hooks/useDelegateInfo';
import { Tooltip } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';

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
    MULTIPAYMENT = 'multipayment'
}

export const getType = (transaction: ConfirmedTransactionData, primaryWallet?: IReadWriteWallet): string => {
    if (transaction.isTransfer()) {
        const isSender = transaction.sender() === primaryWallet?.address();
        const isRecipient = transaction.recipient() === primaryWallet?.address();

        if (isSender && isRecipient) {
            return TransactionType.RETURN;
        } else if (isSender) {
            return TransactionType.SEND;
        } else {
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
    if(transaction.isMultiPayment()) {
        return TransactionType.MULTIPAYMENT;
    }
    return TransactionType.OTHER;
};

export const getTitle = (type: string, isSender: boolean = false): string => {
    const { t } = useTranslation();

    switch (type) {
        case TransactionType.SEND:
            return t('COMMON.SENT');
        case TransactionType.RECEIVE:
            return t('COMMON.RECEIVED');
        case TransactionType.RETURN:
            return t('COMMON.RETURN');
        case TransactionType.SWAP:
            return t('COMMON.SWAP_VOTE');
        case TransactionType.VOTE:
            return t('COMMON.VOTE');
        case TransactionType.UNVOTE:
            return t('COMMON.UNVOTE');
        case TransactionType.SECOND_SIGNATURE:
            return t('COMMON.SECOND_SIGNATURE');
        case TransactionType.REGISTRATION:
            return t('COMMON.REGISTRATION');
        case TransactionType.RESIGNATION:
            return t('COMMON.RESIGNATION');
        case TransactionType.MULTISIGNATURE:
            return t('COMMON.MULTISIGNATURE');
        case TransactionType.MULTIPAYMENT:
            return isSender ? t('COMMON.SENT') : t('COMMON.RECEIVED');
        default:
            return t('COMMON.OTHER');
    }
};

export const getUniqueRecipients = (transaction: ConfirmedTransactionData): MultiPaymentRecipient[] => {
    const uniqueRecipients: MultiPaymentRecipient[] = [];

    transaction.recipients().forEach(recipient => {
        const existingRecipientIndex = uniqueRecipients.findIndex(r => r.address === recipient.address);
        if (existingRecipientIndex !== -1) {
            uniqueRecipients[existingRecipientIndex].amount = uniqueRecipients[existingRecipientIndex].amount.plus(recipient.amount);
        } else {
            uniqueRecipients.push({ address: recipient.address, amount: recipient.amount });
        }
    });

    return uniqueRecipients;
};

const PaymentInfo = ({ address, isSender } : { address: string, isSender: boolean }) => {
    const { t } = useTranslation();

    return (
        <Tooltip content={address}>
            <span>
                {isSender ? t('COMMON.TO') : t('COMMON.FROM')} {trimAddress(address, 'short')}
            </span>
        </Tooltip>
    );
};

export const countUniqueRecipients = (transaction: ConfirmedTransactionData): string | JSX.Element => {
    const { t } = useTranslation();
    const uniqueRecipients = getUniqueRecipients(transaction);
    const count = uniqueRecipients.length;

    return count > 1 ? `${uniqueRecipients.length} ${t('COMMON.RECIPIENTS')}` : <PaymentInfo address={uniqueRecipients[0].address} isSender={true} />;
};

export const getAmountByAddress = (recipients: MultiPaymentRecipient[], address?: string): number => {
    return recipients.find(recipient => recipient.address === address)?.amount.toHuman() ?? 0;
};

export const getMultipaymentAmounts = (recipients: MultiPaymentRecipient[], address: string = ''): {selfAmount: number, sentAmount: number} => {
    const selfAmount = getAmountByAddress(recipients, address);
    let sentAmount = 0;
    recipients.forEach(recipient => {
        sentAmount = sentAmount + recipient.amount.toHuman();
    });

    return { selfAmount, sentAmount: sentAmount - selfAmount };
};

export const getSecondaryText = (
    transaction: ConfirmedTransactionData,
    type: string,
    address?: string,
    primaryWallet?: IReadWriteWallet,
): string | JSX.Element => {
    const { t } = useTranslation();
    const { delegateName } = useDelegateInfo(transaction, primaryWallet);

    switch (type) {
        case TransactionType.SEND:
            return <PaymentInfo address={transaction.recipient()} isSender={true} />;
        case TransactionType.RECEIVE:
            return <PaymentInfo address={transaction.sender()} isSender={false} />;
        case TransactionType.RETURN:
            return t('COMMON.TO_SELF');
        case TransactionType.SWAP:
            return `${t('COMMON.TO')} ${delegateName}`;
        case TransactionType.VOTE:
        case TransactionType.UNVOTE:
            return delegateName;
        case TransactionType.MULTIPAYMENT:
            return transaction.sender() === address ? countUniqueRecipients(transaction) : (
                <PaymentInfo address={transaction.sender()} isSender={false} />
            );
        default:
            return t('COMMON.CONTRACT');
    }
};