import { Contracts } from '@/lib/profiles';
import { Address, LedgerIcon } from '@/components/wallet/address/Address.blocks';
import Amount from '@/components/wallet/Amount';
import constants from '@/constants';
import { generateWalletHelperText } from '@/lib/utils/generateWalletHelperText';
import trimAddress from '@/lib/utils/trimAddress';
import { BigNumber } from '@/app/lib/helpers';

type Props = {
    wallet: Contracts.IReadWriteWallet;
};

export const WalletCard = ({ wallet }: Props) => {
    const hasAlias = wallet.alias() !== undefined;

    const title = hasAlias ? wallet.alias() : trimAddress(wallet.address(), 'long');

    const helperText = generateWalletHelperText(wallet, false);
    const ledgerIndicator = wallet.isLedger();

    return (
        <div className='rounded-2.5xl border-theme-primary-700 shadow-light dark:border-theme-primary-600 dark:bg-subtle-black relative flex max-h-[74px] w-full gap-3 border border-solid bg-white p-4 disabled:pointer-events-none disabled:cursor-not-allowed'>
            <div className='flex w-full items-start gap-3'>
                <div className='flex w-full items-center justify-between'>
                    <div className='flex flex-col items-start gap-1'>
                        <div className='flex flex-row items-center gap-1.5 leading-none'>
                            <div className='text-light-black font-medium dark:text-white'>
                                {title}
                            </div>

                            {ledgerIndicator && <LedgerIcon />}
                        </div>

                        <div className='text-theme-secondary-500 dark:text-theme-secondary-300 flex items-center gap-1.25 text-left text-sm leading-[18px]'>
                            {hasAlias && (
                                <>
                                    <Address
                                        address={wallet.address()}
                                        length={10}
                                        tooltipPlacement='bottom-start'
                                    />
                                    <div> • </div>
                                </>
                            )}

                            {helperText.map((item, index) => {
                                if (index === 0) {
                                    return (
                                        <Amount
                                            value={BigNumber.make(item)}
                                            withTicker
                                            ticker={wallet.currency()}
                                            key={index}
                                            maxDigits={constants.MAX_CURRENCY_DIGITS_ALLOWED}
                                            tooltipPlacement='bottom-start'
                                            underlineOnHover={true}
                                        />
                                    );
                                } else {
                                    return (
                                        <div key={index}>
                                            {index > 0 && helperText.length > 1 && (
                                                <div className='flex gap-1.25'>
                                                    <div> • </div>
                                                    <div>{item}</div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
