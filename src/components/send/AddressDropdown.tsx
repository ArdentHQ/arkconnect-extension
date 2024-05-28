import { ComponentPropsWithRef, useEffect, useMemo, useRef, useState } from 'react';

import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { AddressBookModal } from './AddressBookModal';
import constants from '@/constants';
import { Input } from '@/shared/components';
import Modal from '@/shared/components/modal/Modal';
import trimAddress from '@/lib/utils/trimAddress';
import useAddressBook from '@/lib/hooks/useAddressBook';
import useOnClickOutside from '@/lib/hooks/useOnClickOutside';

type AddressDropdownProps = ComponentPropsWithRef<'input'> & {
    variant: 'primary' | 'destructive';
    helperText?: string;
    value?: string;
    setValue: (value: string) => void;
    handleValidation: () => void;
};

const AddressBookButton = ({ onClick }: { onClick: () => void }) => {
    const { t } = useTranslation();

    return (
        <button
            onClick={onClick}
            className='transition-smoothEase text-theme-primary-700 hover:text-theme-primary-600 dark:text-theme-primary-600 dark:hover:text-theme-primary-650'
        >
            {t('COMMON.ADDRESS_BOOK')}
        </button>
    );
};

export const AddressDropdown = ({
    variant,
    helperText,
    value,
    setValue,
    handleValidation,
    ...rest
}: AddressDropdownProps) => {
    const { t } = useTranslation();
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { filteredAddressBook: addressBook } = useAddressBook();
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
    const [openModal, setOpenModal] = useState(false);

    const suggestions = useMemo(() => {
        if (!value || value.length === 0 || value.length === constants.ADDRESS_LENGTH) {
            return addressBook;
        } else if (value.length > constants.ADDRESS_LENGTH) {
            return [];
        } else {
            return addressBook.filter(
                (contact) =>
                    contact.name.toLowerCase().includes(value.toLowerCase()) ||
                    contact.address.toLowerCase().includes(value.toLowerCase()),
            );
        }
    }, [value, addressBook]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelectedSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (event.key === ' ' && suggestions[selectedSuggestionIndex]) {
            event.preventDefault();
            setValue(suggestions[selectedSuggestionIndex].address);
            setShowSuggestions(false);
        }
    };

    const getDisplayValue = (inputValue?: string) => {
        let displayValue;

        if (inputValue && inputValue.length === constants.ADDRESS_LENGTH) {
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

    const handleModalOpen = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
    };

    const handleModalSelection = (address: string) => {
        setValue(address);
        setOpenModal(false);
    };

    const handlePaste = (event: React.ClipboardEvent) => {
        const pastedValue = event.clipboardData.getData('text');
        if (pastedValue.length === constants.ADDRESS_LENGTH) {
            setShowSuggestions(false);
            handleValidation();
        }
    };

    return (
        <div className='relative' ref={wrapperRef}>
            <Input
                id='receiverAddress'
                className={cn('w-full resize-none rounded-lg py-4 pl-3', {
                    'pr-8': suggestions.length > 0,
                    'pr-3': suggestions.length === 0,
                })}
                hasFocus={showSuggestions}
                value={value}
                onKeyDown={handleKeyDown}
                placeholder={t('PAGES.SEND.ENTER_OR_CHOOSE_FROM_SAVED_ADDRESSES')}
                onClick={() => setShowSuggestions(true)}
                labelText={t('PAGES.SEND.RECIPIENT_ADDRESS')}
                displayValue={getDisplayValue(value)}
                secondaryText={
                    addressBook.length > 0 && <AddressBookButton onClick={handleModalOpen} />
                }
                innerRef={inputRef}
                variant={variant}
                helperText={helperText}
                autoComplete='off'
                onPaste={handlePaste}
                {...rest}
            />
            {showSuggestions && suggestions.length > 0 && (
                <div
                    className={cn(
                        'transition-smoothEase custom-scroll absolute z-10 mt-1 w-full overflow-auto rounded-lg bg-white py-2 shadow-lg dark:bg-subtle-black',
                        {
                            'max-h-72': showSuggestions,
                            'h-0': !showSuggestions,
                        },
                    )}
                >
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            className={cn(
                                'flex w-full cursor-pointer flex-col items-start gap-1 px-4 py-3 hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700',
                            )}
                            onClick={() => {
                                inputRef?.current?.click();
                                inputRef?.current?.focus();
                                setValue(suggestion.address);
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

            {openModal && (
                <Modal
                    variant='danger'
                    onClose={handleModalClose}
                    focusTrapOptions={{
                        initialFocus: false,
                    }}
                    title={t('COMMON.ADDRESS_BOOK')}
                >
                    <AddressBookModal
                        addressBook={addressBook}
                        selectedAddress={value}
                        handleClick={handleModalSelection}
                    />
                </Modal>
            )}
        </div>
    );
};
