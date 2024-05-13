import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Input } from '@/shared/components';
import useAddressBook from '@/lib/hooks/useAddressBook';
import trimAddress from '@/lib/utils/trimAddress';

export const AddressDropdown = () => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [inputValue, setInputValue] = useState('');
    const {addressBook} = useAddressBook();
    const [suggestions, setSuggestions] = useState(addressBook);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

    useEffect(() => {
        if (!inputValue || inputValue.length === 0) {
            setSuggestions(addressBook);
        } else if (inputValue.length >= 32) {
            setSuggestions([]);
        } else {
            setSuggestions(addressBook.filter(contact => contact.name.includes(inputValue) || contact.address.includes(inputValue)));
        }
    }, [inputValue]);

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
        
        if(inputValue.length >= 32) {
            const contact = addressBook.find((contact) => contact.address === inputValue);

            if (contact) {
                displayValue = (
                    <span className='text-base font-normal text-light-black dark:text-white'>
                        {contact.name} <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>({trimAddress(contact.address, 10)})</span>
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

    const isListOpen = (suggestions.length > 0 && showSuggestions);

    return (
        <div className='relative' onBlur={() => setShowSuggestions(true)} ref={wrapperRef}>
            <Input
                className={cn('w-full py-4 pl-3 rounded-lg resize-none', {
                    'pr-8': suggestions.length > 0,
                    'pr-3': suggestions.length === 0
                })}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder='Enter or choose from saved addresses'
                onClick={() =>{
                    setShowSuggestions(true);
                }}
                variant='primary'
                labelText='Recipient Address'
                displayValue={getDisplayValue(inputValue)}
            />
            {isListOpen && (
                <div className={cn('absolute w-full mt-1 overflow-auto max-h-80 bg-white rounded-lg shadow-lg transition-smoothEase z-10 custom-scroll py-2 dark:bg-subtle-black', {
                    'max-h-80': isListOpen,
                    'h-0': !isListOpen
                })}>
                { suggestions.map((suggestion, index) => (
                    <button 
                        key={index} 
                        className={cn('py-3 px-4 cursor-pointer hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700 flex flex-col gap-1 w-full')}
                        onClick={() => {
                            setInputValue(suggestion.address);
                            setShowSuggestions(false);
                        }}
                    >
                        <span className='text-light-black text-base font-medium dark:text-white'>
                            {suggestion.name}
                        </span>
                        <span className='text-sm font-normal text-theme-secondary-500 dark:text-theme-secondary-300'>
                            {trimAddress(suggestion.address, 10)}
                        </span> 
                    </button>
                ))}
                </div>
            )}
            {/* {suggestions.length > 0 && (
                <div 
                    className="absolute top-0 right-0 mt-4 mr-3 cursor-pointer" 
                    onClick={() => {
                        setShowSuggestions((prev) => !prev);
                    }}
                >
                    <Icon icon='arrow-down' className={cn('h-5 w-5 transition-smoothEase dark:text-white', {
                        'transform rotate-180': isListOpen
                    })} />
                </div>
            )} */}
        </div>
    );
};
