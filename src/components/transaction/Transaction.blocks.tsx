import { type JSX } from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { AmountBadge, AmountBadgeType } from './details/AmountBadge';
import {
    getAmountByAddress,
    getMultipaymentAmounts,
    getUniqueRecipients,
    renderAmount,
    TransactionType,
} from '@/components/home/LatestTransactions.utils';
import { Icon, IconDefinition, Tooltip } from '@/shared/components';

import trimAddress from '@/lib/utils/trimAddress';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { useProfileContext } from '@/lib/context/Profile';
import { ExtendedConfirmedTransactionData } from '@/lib/profiles/transaction.dto';
import { BigNumber } from '@/lib/helpers';

export const TransactionIcon = ({ type }: { type: TransactionType }) => {
    const isSpecialTransaction = [
        TransactionType.REGISTRATION,
        TransactionType.RESIGNATION,
        TransactionType.OTHER,
        TransactionType.MULTISIGNATURE,
    ].includes(type);

    return (
        <div className='border-theme-secondary-200 text-theme-secondary-500 dark:border-theme-secondary-600 dark:bg-subtle-black dark:text-theme-secondary-300 flex h-11 min-w-11 items-center justify-center rounded-xl border bg-white'>
            <Icon
                className={cn({
                    'h-5 w-5': isSpecialTransaction,
                    'h-8 w-8': !isSpecialTransaction && type !== TransactionType.RETURN,
                    'h-[22px] w-[22px]': !isSpecialTransaction && type === TransactionType.RETURN,
                })}
                icon={type as IconDefinition}
            />
        </div>
    );
};

const AddressBlock = ({
    address,
    isSecondary = false,
    displayParenthesis = false,
}: {
    address: string;
    isSecondary?: boolean;
    displayParenthesis?: boolean;
}): JSX.Element => {
    return (
        <Tooltip content={address}>
            <span
                className={cn({
                    'text-theme-secondary-500 dark:text-theme-secondary-300': isSecondary,
                })}
            >
                {' '}
                {displayParenthesis ? `(${trimAddress(address, 10)})` : trimAddress(address, 10)}
            </span>
        </Tooltip>
    );
};

export const TransactionAddress = ({
    address,
    displayParenthesis = false,
}: {
    address: string;
    displayParenthesis?: boolean;
}) => {
    const primaryWallet = usePrimaryWallet();
    const network = primaryWallet?.network().id() ?? 'ark.mainnet';

    const { profile } = useProfileContext();
    const wallet = profile.wallets().findByAddressWithNetwork(address, network);
    const displayName = wallet?.displayName() || undefined;

    return displayName ? (
        <span>
            {displayName}
            <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                <AddressBlock
                    address={address}
                    displayParenthesis={displayParenthesis}
                    isSecondary
                />
            </span>
        </span>
    ) : (
        <span>
            <AddressBlock address={address} />
        </span>
    );
};

export const TransactionUniqueRecipients = ({
    transaction,
}: {
    transaction: ExtendedConfirmedTransactionData;
}): JSX.Element | string => {
    const { t } = useTranslation();
    const uniqueRecipients = getUniqueRecipients(transaction);
    const count = uniqueRecipients.length;

    if (count === 1) {
        return <TransactionAddress address={uniqueRecipients[0].address} />;
    }

    return `${count} ${t('COMMON.RECIPIENTS')}`;
};

export const TransactionAmount = ({
    transaction,
}: {
    transaction: ExtendedConfirmedTransactionData;
}): JSX.Element => {
    const primaryWallet = usePrimaryWallet();

    const address = primaryWallet?.address() ?? '';
    const primaryCurrency = primaryWallet?.currency() ?? 'ARK';

    const renderAmountBadge = ({
        value,
        isNegative,
        showSign,
        type,
        selfAmount,
    }: {
        value: BigNumber;
        isNegative: boolean;
        showSign: boolean;
        type: AmountBadgeType;
        selfAmount?: string;
    }) => (
        <div className='flex w-full items-center justify-between'>
            <AmountBadge
                amount={renderAmount({
                    value,
                    isNegative,
                    showSign,
                    primaryCurrency,
                    displayTooltip: true,
                })}
                type={type}
                selfAmount={selfAmount}
            />
        </div>
    );

    if (transaction.isMultiPayment()) {
        const uniqueRecipients = getUniqueRecipients(transaction);

        if (transaction.isSent()) {
            const { selfAmount, sentAmount } = getMultipaymentAmounts(uniqueRecipients, address);
            const isSenderAndRecipient = uniqueRecipients.some(
                (recipient) => recipient.address === address,
            );

            return renderAmountBadge({
                value: sentAmount,
                isNegative: true,
                showSign: sentAmount !== BigNumber.ZERO,
                type:
                    sentAmount !== BigNumber.ZERO
                        ? AmountBadgeType.NEGATIVE
                        : AmountBadgeType.DEFAULT,
                selfAmount: isSenderAndRecipient ? `${selfAmount} ${primaryCurrency}` : undefined,
            });
        } else {
            const amount = getAmountByAddress(uniqueRecipients, address);
            return renderAmountBadge({
                value: amount,
                isNegative: false,
                showSign: false,
                type: AmountBadgeType.POSITIVE,
            });
        }
    }

    const badgeType = transaction.isReturn()
        ? AmountBadgeType.DEFAULT
        : transaction.isReceived()
          ? AmountBadgeType.POSITIVE
          : AmountBadgeType.NEGATIVE;

    return renderAmountBadge({
        value: transaction.value(),
        isNegative: transaction.isSent(),
        showSign: !transaction.isReturn(),
        type: badgeType,
    });
};
