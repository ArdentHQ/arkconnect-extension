import { TokenAvatar } from './TokenAvatar';
import { WalletToken } from '@/lib/profiles/wallet-token';

export const TokenHeader = ({ token }: { token: WalletToken }) => {
    return (
        <div className='ring-theme-secondary-200 dark:bg-subtle-black dark:ring-theme-secondary-700 flex flex-row items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-inset'>
            <TokenAvatar token={token} />

            <span className='text-light-black truncate text-base font-medium dark:text-white'>
                {token.token().name()}
            </span>
        </div>
    );
};
