import { useMemo, useState } from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import Modal from '@/shared/components/modal/Modal';
import { Icon } from '@/shared/components';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { WalletToken } from '@/lib/profiles/wallet-token';

type AssetOption =
    | { kind: 'native'; ticker: string; name: string }
    | { kind: 'token'; token: WalletToken };

const AssetAvatar = ({ label }: { label: string }) => {
    const initial = label.slice(0, 1).toUpperCase();

    return (
        <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-theme-primary-600 text-lg font-semibold leading-none text-white'>
            {initial}
        </div>
    );
};

const AssetRow = ({
    option,
    onSelect,
    isSelected,
}: {
    option: AssetOption;
    onSelect: () => void;
    isSelected: boolean;
}) => {
    const name = option.kind === 'native' ? option.name : option.token.token().name();
    const symbol = option.kind === 'native' ? option.ticker : option.token.token().displaySymbol();

    return (
        <button
            type='button'
            onClick={onSelect}
            className={cn(
                'flex h-16 w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700',
                {
                    'bg-theme-secondary-50 dark:bg-theme-secondary-700': isSelected,
                },
            )}
        >
            <AssetAvatar label={symbol || name} />
            <div className='flex min-w-0 flex-1 items-center gap-2 overflow-hidden'>
                <span className='typeset-headline min-w-0 truncate font-medium text-light-black dark:text-white'>
                    {name}
                </span>
                <span className='typeset-headline shrink-0 font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                    {symbol}
                </span>
            </div>
        </button>
    );
};

export const AssetSelector = ({
    value,
    tokens,
    onChange,
}: {
    value?: string;
    tokens: WalletToken[];
    onChange: (tokenAddress?: string) => void;
}) => {
    const { t } = useTranslation();
    const primaryWallet = usePrimaryWallet();
    const [isOpen, setIsOpen] = useState(false);

    const nativeTicker = primaryWallet?.currency() ?? 'ARK';
    const nativeName = primaryWallet?.network().coinName() ?? 'ARK';

    const options = useMemo<AssetOption[]>(
        () => [
            { kind: 'native', ticker: nativeTicker, name: nativeName },
            ...tokens.map((token) => ({ kind: 'token' as const, token })),
        ],
        [nativeTicker, nativeName, tokens],
    );

    const selected = useMemo<AssetOption>(() => {
        if (!value) return options[0];
        const found = tokens.find((token) => token.token().address() === value);
        return found ? { kind: 'token', token: found } : options[0];
    }, [value, tokens, options]);

    const handleSelect = (option: AssetOption) => {
        onChange(option.kind === 'native' ? undefined : option.token.token().address());
        setIsOpen(false);
    };

    const selectedName = selected.kind === 'native' ? selected.name : selected.token.token().name();
    const selectedSymbol =
        selected.kind === 'native' ? selected.ticker : selected.token.token().displaySymbol();

    return (
        <div className='flex flex-col gap-1.5'>
            <label className='typeset-body font-medium text-theme-secondary-500 dark:text-theme-secondary-300'>
                {t('PAGES.SEND.ASSET')}
            </label>

            <button
                type='button'
                onClick={() => setIsOpen(true)}
                className='transition-smoothEase flex w-full items-center justify-between gap-2 overflow-hidden rounded-lg border border-theme-secondary-200 bg-white p-3 text-left shadow-secondary-dark outline-none hover:border-theme-secondary-300 dark:border-theme-secondary-600 dark:bg-subtle-black dark:hover:border-theme-secondary-500'
            >
                <div className='flex min-w-0 flex-1 items-center gap-2 overflow-hidden'>
                    <AssetAvatar label={selectedSymbol || selectedName} />
                    <span className='typeset-headline min-w-0 truncate font-medium text-light-black dark:text-white'>
                        {selectedName}
                    </span>
                </div>
                <div className='flex shrink-0 items-center gap-2 text-theme-secondary-500 dark:text-theme-secondary-300'>
                    <span className='typeset-headline max-w-[80px] truncate font-medium'>
                        {selectedSymbol}
                    </span>
                    <Icon icon='arrow-down' className='h-4 w-4' />
                </div>
            </button>

            {isOpen && (
                <Modal
                    onClose={() => setIsOpen(false)}
                    containerPadding='0'
                    containerClassName='w-[330px] rounded-xl overflow-hidden'
                    hideCloseButton
                    title={t('PAGES.SEND.SELECT_ASSET')}
                >
                    <div className='max-h-[300px] overflow-auto'>
                        {options.map((option) => {
                            const key =
                                option.kind === 'native'
                                    ? `native:${option.ticker}`
                                    : option.token.token().address();
                            const isSelected =
                                option.kind === 'native'
                                    ? !value
                                    : option.token.token().address() === value;

                            return (
                                <AssetRow
                                    key={key}
                                    option={option}
                                    onSelect={() => handleSelect(option)}
                                    isSelected={isSelected}
                                />
                            );
                        })}
                    </div>
                </Modal>
            )}
        </div>
    );
};
