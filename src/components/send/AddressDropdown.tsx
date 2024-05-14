import { useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { Input } from '@/shared/components';
import useAddressBook from '@/lib/hooks/useAddressBook';
import trimAddress from '@/lib/utils/trimAddress';
import useOnClickOutside from '@/lib/hooks/useOnClickOutside';

export const AddressDropdown = () => {
    const addressLength = 32;

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [inputValue, setInputValue] = useState('');
    const { addressBook } = useAddressBook();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

    const suggestions = useMemo(() => {
        if (!inputValue || inputValue.length === 0) {
            return addressBook;
        } else if (inputValue.length >= addressLength) {
            return [];
        } else {
            return addressBook.filter(
                (contact) =>
                    contact.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                    contact.address.toLowerCase().includes(inputValue.toLowerCase()),
            );
        }
    }, [inputValue, addressBook]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        setShowSuggestions(true);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelectedSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (event.key === ' ' && suggestions[selectedSuggestionIndex]) {
            event.preventDefault();
            setInputValue(suggestions[selectedSuggestionIndex].address);
            setShowSuggestions(false);
        }
    };

    const getDisplayValue = (inputValue: string) => {
        let displayValue;

        if (inputValue.length >= addressLength) {
            const contact = addressBook.find((contact) => contact.address === inputValue);

            if (contact) {
                displayValue = (
                    <span className='text-base font-normal text-light-black dark:text-white'>
                        {contact.name}{' '}
                        <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                            ({trimAddress(contact.address, 10)})
                        </span>
                    </span>
                );
            }
        }

        return displayValue;
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    useOnClickOutside(wrapperRef, () => setShowSuggestions(false));

    return (
        <div className='relative' ref={wrapperRef}>
            <Input
                className={cn('w-full resize-none rounded-lg py-4 pl-3', {
                    'pr-8': suggestions.length > 0,
                    'pr-3': suggestions.length === 0,
                })}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder='Enter or choose from saved addresses'
                onClick={() => setShowSuggestions(true)}
                variant='primary'
                labelText='Recipient Address'
                displayValue={getDisplayValue(inputValue)}
            />
            {showSuggestions && suggestions.length > 0 && (
                <div
                    className={cn(
                        'transition-smoothEase custom-scroll absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-lg bg-white py-2 shadow-lg dark:bg-subtle-black',
                        {
                            'max-h-80': showSuggestions,
                            'h-0': !showSuggestions,
                        },
                    )}
                >
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            className={cn(
                                'flex w-full cursor-pointer flex-col gap-1 px-4 py-3 hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700',
                            )}
                            onClick={() => {
                                setInputValue(suggestion.address);
                                setShowSuggestions(false);
                            }}
                        >
                            <span className='text-base font-medium text-light-black dark:text-white'>
                                {suggestion.name}
                            </span>
                            <span className='text-sm font-normal text-theme-secondary-500 dark:text-theme-secondary-300'>
                                {trimAddress(suggestion.address, 10)}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
