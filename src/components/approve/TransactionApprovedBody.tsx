import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastPosition } from '../toast/ToastContainer';
import ActionDetails, {
    ActionDetailsFiatValue,
    ActionDetailsRow,
    ActionDetailsValue,
} from './ActionDetails';
import Amount from '@/components/wallet/Amount';
import { ToastPosition } from '@/components/toast/ToastContainer';
import useClipboard from '@/lib/hooks/useClipboard';
import trimAddress from '@/lib/utils/trimAddress';
import { Icon } from '@/shared/components';
import getActiveCoin from '@/lib/utils/getActiveCoin';
import { WalletNetwork } from '@/lib/store/wallet';

const TransactionApprovedBody = () => {
    const { state } = useLocation();
    const { copy } = useClipboard();
    const { t } = useTranslation();

    const showFiat = state.walletNetwork === WalletNetwork.MAINNET;

    return (
        <div className='w-full'>
            <ActionDetails maxHeight='229px'>
                <ActionDetailsRow label='Sender'>
                    <ActionDetailsValue>
                        {trimAddress(state?.transaction.sender, 'short')}
                    </ActionDetailsValue>
                </ActionDetailsRow>

                <ActionDetailsRow
                    label={t('COMMON.AMOUNT')}
                    below={
                        showFiat && (
                            <ActionDetailsFiatValue>
                                <Amount
                                    value={state?.transaction.convertedAmount as number}
                                    ticker={state?.transaction.exchangeCurrency as string}
                                />
                            </ActionDetailsFiatValue>
                        )
                    }
                >
                    <div className='flex items-baseline gap-1'>
                        <ActionDetailsValue>
                            <Amount
                                value={state?.transaction.amount}
                                ticker={getActiveCoin(state?.walletNetwork)}
                            />
                        </ActionDetailsValue>
                    </div>
                </ActionDetailsRow>

                <ActionDetailsRow label={t('COMMON.RECEIVER')}>
                    <ActionDetailsValue>
                        {trimAddress(state?.transaction.receiver, 'short')}
                    </ActionDetailsValue>
                </ActionDetailsRow>

                <ActionDetailsRow
                    label={t('COMMON.TRANSACTION_FEE')}
                    below={
                        showFiat && (
                            <ActionDetailsFiatValue>
                                <Amount
                                    value={state?.transaction.convertedFee as number}
                                    ticker={state?.transaction.exchangeCurrency as string}
                                />
                            </ActionDetailsFiatValue>
                        )
                    }
                >
                    <div className='flex items-baseline gap-1'>
                        <ActionDetailsValue>
                            <Amount
                                value={state?.transaction.fee}
                                ticker={getActiveCoin(state?.walletNetwork)}
                            />
                        </ActionDetailsValue>
                    </div>
                </ActionDetailsRow>

                <ActionDetailsRow
                    label={t('COMMON.TOTAL_AMOUNT')}
                    below={
                        showFiat && (
                            <ActionDetailsFiatValue>
                                <Amount
                                    value={state?.transaction.convertedTotal as number}
                                    ticker={state?.transaction.exchangeCurrency as string}
                                />
                            </ActionDetailsFiatValue>
                        )
                    }
                >
                    <div className='flex items-baseline gap-1'>
                        <ActionDetailsValue>
                            <Amount
                                value={state?.transaction.total}
                                ticker={getActiveCoin(state?.walletNetwork)}
                            />
                        </ActionDetailsValue>
                    </div>
                </ActionDetailsRow>

                <ActionDetailsRow label={t('COMMON.TRANSACTION_ID')}>
                    <div className='flex items-center gap-1'>
                        <ActionDetailsValue>
                            {trimAddress(state?.transaction.id, 'short')}
                        </ActionDetailsValue>

                        <button
                            type='button'
                            onClick={() =>
                                copy(
                                    state?.transaction.id,
                                    t('COMMON.TRANSACTION_ID'),
                                    ToastPosition.HIGH,
                                )
                            }
                            className='block'
                        >
                            <Icon
                                icon='copy'
                                className='h-5 w-5 text-theme-primary-700 dark:text-theme-primary-650'
                            />
                        </button>
                    </div>
                </ActionDetailsRow>
            </ActionDetails>
        </div>
    );
};

export default TransactionApprovedBody;
