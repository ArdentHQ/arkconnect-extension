import { useTranslation } from 'react-i18next';
import { ActionDetailsFiatValue, ActionDetailsRow, ActionDetailsValue } from './ActionDetails';
import {  Icon, Tooltip } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';
import useClipboard from '@/lib/hooks/useClipboard';
import Amount from '@/components/wallet/Amount';

interface ActionBodyRowProps {
    label: string;
    value?: React.ReactNode;
    below?: React.ReactNode;
    tooltipContent?: React.ReactNode;
}

export const ActionBodyRow = ({ label, below, value, tooltipContent }: ActionBodyRowProps) => (
    <ActionDetailsRow label={label} below={below}>
        {tooltipContent ? (
            <Tooltip content={tooltipContent} placement='bottom-end'>
                <ActionDetailsValue>{value}</ActionDetailsValue>
            </Tooltip>
        ) : (
            <ActionDetailsValue>{value}</ActionDetailsValue>
        )}
    </ActionDetailsRow>
);

interface ActionAmountRowProps {
    label: string;
    showFiat: boolean;
    amount: number;
    convertedAmount: number;
    exchangeCurrency: string;
    amountTicker?: string;
    withTicker?: boolean;
    network?: string;
}

export const ActionAmountRow = ({
    label,
    showFiat,
    amount,
    convertedAmount,
    exchangeCurrency,
    amountTicker,
    network,
}: ActionAmountRowProps) => {
    return (
        <ActionDetailsRow
            label={label}
            below={
                showFiat && (
                    <ActionDetailsFiatValue>
                        <Amount
                            value={convertedAmount}
                            ticker={exchangeCurrency}
                        />
                    </ActionDetailsFiatValue>
                )
            }
        >
            <div className='flex items-baseline gap-1'>
                <ActionDetailsValue>
                    {
                        amountTicker ? (
                            <Amount
                                value={amount}
                                ticker={amountTicker}
                                withTicker
                            />
                        ) : (
                            <span>
                                {amount} {network}
                            </span>
                        )
                    }
                </ActionDetailsValue>
            </div>
        </ActionDetailsRow>
    );
};

export const ActionTransactionIdRow = ({
    transactionId,
}: {
    transactionId: string;
}) => {
    const { t } = useTranslation();
    const { copy } = useClipboard();

    return (
        <ActionDetailsRow label={t('COMMON.TRANSACTION_ID')}>
            <div className='flex items-center gap-1'>
                <ActionDetailsValue>
                    {trimAddress(transactionId, 'short')}
                </ActionDetailsValue>
                <button
                    type='button'
                    className='block'
                    onClick={() => copy(transactionId, t('COMMON.TRANSACTION_ID'))}
                >
                    <Icon
                        icon='copy'
                        className='h-5 w-5 text-theme-primary-700 dark:text-theme-primary-650'
                    />
                </button>
            </div>
        </ActionDetailsRow>
    );
}; 