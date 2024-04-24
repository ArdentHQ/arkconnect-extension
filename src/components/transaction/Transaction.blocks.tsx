import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { ExtendedConfirmedTransactionData } from '@ardenthq/sdk-profiles/distribution/esm/transaction.dto';
import { AmountBadge, AmountBadgeType } from './details/AmountBadge';
import Amount from '@/components/wallet/Amount';
import { Icon, IconDefinition, Tooltip } from '@/shared/components';
import {
    getAmountByAddress,
    getMultipaymentAmounts,
    getUniqueRecipients,
    renderAmount,
    TransactionType,
} from '@/components/home/LatestTransactions.utils';
import { useProfileContext } from '@/lib/context/Profile';
import trimAddress from '@/lib/utils/trimAddress';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { useExchangeRate } from '@/lib/hooks/useExchangeRate';

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
}: {
    address: string;
    isSecondary?: boolean;
}): JSX.Element => {
    return (
        <Tooltip content={address}>
            <span
                className={cn({
                    'text-theme-secondary-500 dark:text-theme-secondary-300': isSecondary,
                })}
            >
                {trimAddress(address, 'short')}
            </span>
        </Tooltip>
    );
};

export const TransactionAddress = ({ address }: { address: string }) => {
    const primaryWallet = usePrimaryWallet();
    const network = primaryWallet?.network().id() ?? 'ark.mainnet';

    const { profile } = useProfileContext();
    const wallet = profile.wallets().findByAddressWithNetwork(address, network);
    const displayName = wallet?.displayName() || undefined;

    return displayName ? (
        <span>
            {displayName} <AddressBlock address={address} isSecondary />
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
    }: {
        value: number;
        isNegative: boolean;
        showSign: boolean;
        type: AmountBadgeType;
        selfAmount?: string;
        isDevnet?: boolean;
    }) => (
        <>
            <AmountBadge
                amount={renderAmount({
                    value,
                    isNegative,
                    showSign,
                    primaryCurrency,
                })}
                type={type}
                selfAmount={selfAmount}
            />
            {!isDevnet && (
                <span className='pl-0.5 text-theme-secondary-500 dark:text-theme-secondary-300'>
                    <Amount
                        value={convert(value)}
                        ticker={primaryWallet?.exchangeCurrency() ?? 'USD'}
                        underlineOnHover={true}
                    />
                </span>
            )}
        </>
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
            });
        } else {
            const amount = getAmountByAddress(uniqueRecipients, address);
            return renderAmountBadge({
                value: amount,
                isNegative: false,
                showSign: false,
                type: AmountBadgeType.POSITIVE,
                isDevnet: primaryWallet?.network().isTest(),
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
    });
};
