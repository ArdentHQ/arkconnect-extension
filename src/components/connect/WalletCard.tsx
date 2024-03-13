import { Contracts } from '@ardenthq/sdk-profiles';
import { Address, LedgerIcon, TestnetIcon } from '../wallet/address/Address.blocks';
import Amount from '../wallet/Amount';
import constants from '@/constants';
import { generateWalletHelperText } from '@/lib/utils/generateWalletHelperText';
import trimAddress from '@/lib/utils/trimAddress';

type Props = {
    wallet: Contracts.IReadWriteWallet;
};

export const WalletCard = ({ wallet }: Props) => {
    const hasAlias = wallet.alias() !== undefined;

    const title = hasAlias ? wallet.alias() : trimAddress(wallet.address(), 'long');

    const helperText = generateWalletHelperText(wallet, false);
    const testnetIndicator = wallet.network().isTest();
    const ledgerIndicator = wallet.isLedger();

    return (
        <div className='relative flex max-h-[74px] w-full gap-3 rounded-[20px]  border border-solid border-theme-primary-700 bg-white p-4 shadow-light disabled:pointer-events-none disabled:cursor-not-allowed dark:border-theme-primary-600 dark:bg-subtle-black'>
            <div className='flex w-full items-start gap-3'>
                <div className='flex w-full items-center justify-between'>
                    <div className='flex flex-col items-start gap-1'>
                        <div className='flex flex-row items-center gap-1.5 leading-none'>
                            <div className='font-medium text-light-black dark:text-white'>
                                {title}
                            </div>

                            {ledgerIndicator && <LedgerIcon />}
                            {testnetIndicator && <TestnetIcon />}
                        </div>

                        <div className='flex items-center gap-[5px] text-left text-sm leading-[18px] text-theme-secondary-500 dark:text-theme-secondary-300'>
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
                                            value={Number(item)}
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
                                                <div className='flex gap-[5px]'>
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
