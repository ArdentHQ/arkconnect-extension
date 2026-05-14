import { WalletToken } from '@/lib/profiles/wallet-token';

export const TokenAvatar = ({ token }: { token: WalletToken }) => {
    const symbol = token.token().symbol() || token.token().name();
    const initial = symbol.slice(0, 1).toUpperCase();

    return (
        <div className='bg-theme-primary-600 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg leading-none font-semibold text-white'>
            {initial}
        </div>
    );
};
