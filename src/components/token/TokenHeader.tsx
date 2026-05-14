import { WalletToken } from '@/lib/profiles/wallet-token';
import { TokenAvatar } from './TokenAvatar';

export const TokenHeader = ({ token }: { token: WalletToken }) => {
    return (
        <div className='flex flex-row items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-inset ring-theme-secondary-200 dark:bg-subtle-black dark:ring-theme-secondary-700'>
            <TokenAvatar token={token} />

            <span className='truncate text-base font-medium text-light-black dark:text-white'>
                {token.token().name()}
            </span>
        </div>
    );
};
