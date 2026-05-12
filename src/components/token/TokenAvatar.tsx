import seedrandom from 'seedrandom';
import { WalletToken } from '@/lib/profiles/wallet-token';

const TOKEN_AVATAR_COLORS = [
    '2196F3',
    '4CAF50',
    'FF9800',
    '9C27B0',
    'F44336',
    '00BCD4',
    '5EB8FC',
    'EF7C6D',
    'FA9EDC',
];

const tokenAvatarColor = (seed: string): string => {
    const rng = seedrandom(seed);
    return TOKEN_AVATAR_COLORS[Math.floor(rng() * TOKEN_AVATAR_COLORS.length)];
};

export const TokenAvatar = ({
    token,
    size = 'md',
}: {
    token: WalletToken;
    size?: 'md' | 'lg' | string;
}) => {
    const symbol = token.token().symbol() || token.token().name();
    const initial = symbol.slice(0, 1).toUpperCase();
    const color = tokenAvatarColor(symbol);

    let sizeClass;
    switch (size) {
        case 'lg':
            sizeClass = 'h-11 w-11 text-base';
            break;

        case 'md':
            sizeClass = 'h-9 w-9 text-sm';
            break;

        default:
            sizeClass = size;
    }

    size === 'lg' ? 'h-11 w-11 text-base' : 'h-9 w-9 text-sm';

    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${sizeClass}`}
            style={{ backgroundColor: `#${color}` }}
        >
            {initial}
        </div>
    );
};
