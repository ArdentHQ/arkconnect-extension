import { IReadWriteWallet } from '@ardenthq/sdk-profiles/distribution/esm/wallet.contract';
import { useTranslation } from 'react-i18next';
import {
    ExtendedConfirmedTransactionData,
    ExtendedTransactionRecipient,
} from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
import { useDelegateInfo } from '@/lib/hooks/useDelegateInfo';
import { Icon, IconDefinition, Tooltip } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';
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

const PaymentInfo = ({ address, isSent }: { address: string; isSent: boolean }) => {
    const { t } = useTranslation();

    return (
        <Tooltip content={address}>
            <span>
                {isSent ? t('COMMON.TO') : t('COMMON.FROM')} {trimAddress(address, 'short')}
            </span>
        </Tooltip>
    );
};

export const countUniqueRecipients = (
    transaction: ExtendedConfirmedTransactionData,
): string | JSX.Element => {
    const { t } = useTranslation();
    const uniqueRecipients = getUniqueRecipients(transaction);
    const count = uniqueRecipients.length;

    return count > 1 ? (
        `${uniqueRecipients.length} ${t('COMMON.RECIPIENTS')}`
    ) : (
        <PaymentInfo address={uniqueRecipients[0].address} isSent={true} />
    );
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

export const getSecondaryText = (
    transaction: ExtendedConfirmedTransactionData,
    type: string,
    address?: string,
    primaryWallet?: IReadWriteWallet,
): string | JSX.Element => {
    const { t } = useTranslation();
    const { delegateName } = useDelegateInfo(transaction, primaryWallet);

    switch (type) {
        case TransactionType.SEND:
            return <PaymentInfo address={transaction.recipient()} isSent={true} />;
        case TransactionType.RECEIVE:
            return <PaymentInfo address={transaction.sender()} isSent={false} />;
        case TransactionType.RETURN:
            return t('COMMON.TO_SELF');
        case TransactionType.SWAP:
            return `${t('COMMON.TO')} ${delegateName}`;
        case TransactionType.VOTE:
        case TransactionType.UNVOTE:
            return delegateName;
        case TransactionType.MULTIPAYMENT:
            return transaction.sender() === address ? (
                countUniqueRecipients(transaction)
            ) : (
                <PaymentInfo address={transaction.sender()} isSent={false} />
            );
        default:
            return t('COMMON.CONTRACT');
    }
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
} : {value: number, isNegative: boolean, showSign: boolean, primaryCurrency: string}) => (
    <Amount
        value={value}
        ticker={primaryCurrency}
        tooltipPlacement='bottom-end'
        withTicker
        showSign={showSign}
        isNegative={isNegative}
        maxDigits={20}
    />
);

export const getTransactionAmount = (
    transaction: ExtendedConfirmedTransactionData,
    primaryCurrency: string,
    address?: string,
): string | JSX.Element => {
    const type = getType(transaction);
    const isMultipayment = type === TransactionType.MULTIPAYMENT;
    const amount = transaction.amount();

    if (isMultipayment) {
        const uniqueRecipients = getUniqueRecipients(transaction);

        if (transaction.isSent()) {
            const { selfAmount, sentAmount } = getMultipaymentAmounts(uniqueRecipients, address);
            const isSenderAndRecipient = uniqueRecipients.some(
                (recipient) => recipient.address === address,
            );

            return (
                <span className='flex flex-row gap-0.5'>
                    {renderAmount({value: sentAmount, isNegative: true, showSign: sentAmount !== 0, primaryCurrency})}

                    {isSenderAndRecipient && (
                        <Tooltip
                            content={`Excluding ${selfAmount} ${primaryCurrency} sent to self`}
                        >
                            <div className='h-5 w-5 rounded-full bg-transparent p-0.5 text-subtle-black hover:bg-theme-secondary-50 dark:text-white dark:hover:bg-theme-secondary-700'>
                                <Icon icon='information-circle' />
                            </div>
                        </Tooltip>
                    )}
                </span>
            );
        } else {
            return renderAmount({value: getAmountByAddress(uniqueRecipients, address), isNegative: false, showSign: true, primaryCurrency});
        }
    }

    return renderAmount({value: amount, isNegative: type === TransactionType.SEND, showSign: type !== TransactionType.RETURN, primaryCurrency});
};
