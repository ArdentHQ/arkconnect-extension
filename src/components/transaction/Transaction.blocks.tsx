import cn from 'classnames';
import { ExtendedConfirmedTransactionData } from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
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

import Amount from '@/components/wallet/Amount';
import trimAddress from '@/lib/utils/trimAddress';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { useProfileContext } from '@/lib/context/Profile';

export const TransactionIcon = ({ type }: { type: TransactionType }) => {
    const isSpecialTransaction = [
        TransactionType.REGISTRATION,
        TransactionType.RESIGNATION,
        TransactionType.OTHER,
        TransactionType.SECOND_SIGNATURE,
        TransactionType.MULTISIGNATURE,
    ].includes(type);

    return (
        <div className='flex h-11 min-w-11 items-center justify-center rounded-xl border border-theme-secondary-200 bg-white text-theme-secondary-500 dark:border-theme-secondary-600 dark:bg-subtle-black dark:text-theme-secondary-300'>
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
    displayFiat = true,
}: {
    transaction: ExtendedConfirmedTransactionData;
    displayFiat?: boolean;
}): JSX.Element => {
    const primaryWallet = usePrimaryWallet();
    const { convert } = useExchangeRate({
        exchangeTicker: primaryWallet?.exchangeCurrency(),
        ticker: primaryWallet?.currency(),
    });

    const address = primaryWallet?.address() ?? '';
    const primaryCurrency = primaryWallet?.currency() ?? 'ARK';

    const renderAmountBadge = ({
        value,
        isNegative,
        showSign,
        type,
        selfAmount,
        isDevnet,
        displayFiat,
    }: {
        value: number;
        isNegative: boolean;
        showSign: boolean;
        type: AmountBadgeType;
        selfAmount?: string;
        isDevnet?: boolean;
        displayFiat?: boolean;
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
            {(!isDevnet && displayFiat) && (
                <span className='pl-0.5 text-theme-secondary-500 dark:text-theme-secondary-300'>
                    <Amount
                        value={convert(value)}
                        ticker={primaryWallet?.exchangeCurrency() ?? 'USD'}
                        underlineOnHover={true}
                    />
                </span>
            )}
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
                showSign: sentAmount !== 0,
                type: sentAmount !== 0 ? AmountBadgeType.NEGATIVE : AmountBadgeType.DEFAULT,
                selfAmount: isSenderAndRecipient ? `${selfAmount} ${primaryCurrency}` : undefined,
                isDevnet: primaryWallet?.network().isTest(),
                displayFiat,
            });
        } else {
            const amount = getAmountByAddress(uniqueRecipients, address);
            return renderAmountBadge({
                value: amount,
                isNegative: false,
                showSign: false,
                type: AmountBadgeType.POSITIVE,
                isDevnet: primaryWallet?.network().isTest(),
                displayFiat,
            });
        }
    }

    const badgeType = transaction.isReturn()
        ? AmountBadgeType.DEFAULT
        : transaction.isReceived()
          ? AmountBadgeType.POSITIVE
          : AmountBadgeType.NEGATIVE;

    return renderAmountBadge({
        value: transaction.amount(),
        isNegative: transaction.isSent(),
        showSign: !transaction.isReturn(),
        type: badgeType,
        isDevnet: primaryWallet?.network().isTest(),
        displayFiat,
    });
};
