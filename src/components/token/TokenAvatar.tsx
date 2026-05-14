import { WalletToken } from '@/lib/profiles/wallet-token';

export const TokenAvatar = ({ token }: { token: WalletToken }) => {
    const symbol = token.token().symbol() || token.token().name();
    const initial = symbol.slice(0, 1).toUpperCase();

    return (
        <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-theme-primary-600 text-lg font-semibold leading-none text-white'>
            {initial}
        </div>
    );
};
