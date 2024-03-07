import { useLocation } from 'react-router-dom';
import Amount from '../wallet/Amount';
import { ToastPosition } from '../toast/ToastContainer';
import ActionDetails, { ActionDetailsRow } from './ActionDetails';
import useClipboard from '@/lib/hooks/useClipboard';
import trimAddress from '@/lib/utils/trimAddress';
import { Icon } from '@/shared/components';
import getActiveCoin from '@/lib/utils/getActiveCoin';
import { WalletNetwork } from '@/lib/store/wallet';

const TransactionApprovedBody = () => {
    const { state } = useLocation();
    const { copy } = useClipboard();

    return (
        <div className='w-full'>
            <ActionDetails maxHeight='229px'>
                <ActionDetailsRow label='Sender'>
                    <div className='font-medium text-light-black dark:text-white'>
                        {trimAddress(state?.transaction.sender, 'short')}
                    </div>
                </ActionDetailsRow>

                <ActionDetailsRow label='Amount'>
                    <div className='flex items-baseline gap-1'>
                        <div className='font-medium text-light-black dark:text-white'>
                            <Amount
                                value={state?.transaction.amount}
                                ticker={getActiveCoin(state?.walletNetwork)}
                            />
                        </div>
                        {state.walletNetwork === WalletNetwork.MAINNET && (
                            <div className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                                <Amount
                                    value={state?.transaction.convertedAmount as number}
                                    ticker={state?.transaction.exchangeCurrency as string}
                                />
                            </div>
                        )}
                    </div>
                </ActionDetailsRow>

                <ActionDetailsRow label='Receiver'>
                    <div className='font-medium text-light-black dark:text-white'>
                        {trimAddress(state?.transaction.receiver, 'short')}
                    </div>
                </ActionDetailsRow>

                <ActionDetailsRow label='Transaction Fee'>
                    <div className='flex items-baseline gap-1'>
                        <div className='font-medium text-light-black dark:text-white'>
                            <Amount
                                value={state?.transaction.fee}
                                ticker={getActiveCoin(state?.walletNetwork)}
                            />
                        </div>
                        {state.walletNetwork === WalletNetwork.MAINNET && (
                            <div className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                                <Amount
                                    value={state?.transaction.convertedFee as number}
                                    ticker={state?.transaction.exchangeCurrency as string}
                                />
                            </div>
                        )}
                    </div>
                </ActionDetailsRow>

                <ActionDetailsRow label='Total Amount'>
                    <div className='flex items-baseline gap-1'>
                        <div className='font-medium text-light-black dark:text-white'>
                            <Amount
                                value={state?.transaction.total}
                                ticker={getActiveCoin(state?.walletNetwork)}
                            />
                        </div>
                        {state.walletNetwork === WalletNetwork.MAINNET && (
                            <div className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                                <Amount
                                    value={state?.transaction.convertedTotal as number}
                                    ticker={state?.transaction.exchangeCurrency as string}
                                />
                            </div>
                        )}
                    </div>
                </ActionDetailsRow>

                <ActionDetailsRow label='Transaction ID'>
                    <div className='flex items-center gap-1'>
                        <div className='font-medium text-light-black dark:text-white'>
                            {trimAddress(state?.transaction.id, 'short')}
                        </div>

                        <button
                            type='button'
                            onClick={() =>
                                copy(state?.transaction.id, 'Transaction ID', ToastPosition.HIGH)
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
