import cn from 'classnames';
import { Contact } from '@/lib/hooks/useAddressBook';
import trimAddress from '@/lib/utils/trimAddress';
import { Icon } from '@/shared/components';

const ContactItem = ({
    contact,
    onSelect,
    isSelected,
}: {
    contact: Contact;
    onSelect: (contact: string) => void;
    isSelected: boolean;
}) => {
    return (
        <button
            className={cn(
                'transition-smoothEase flex h-[66px] w-[306px] flex-row items-center justify-between px-4 py-3',
                {
                    'rounded-lg bg-theme-primary-50 dark:bg-theme-primary-800/25': isSelected,
                    'dark:bg-light-black-black border-b border-b-theme-secondary-200 hover:rounded-lg hover:border-transparent hover:bg-theme-secondary-50 dark:border-b-theme-secondary-700 dark:hover:bg-theme-secondary-700':
                        !isSelected,
                },
            )}
            onClick={() => onSelect(contact.address)}
        >
            <span className='flex flex-col items-start gap-1'>
                <span className='text-base font-medium leading-5 text-light-black dark:text-white'>
                    {contact.name}
                </span>
                <span className='text-sm font-normal text-theme-secondary-500 dark:text-theme-secondary-300'>
                    {trimAddress(contact.address, 10)}
                </span>
            </span>
            {isSelected && (
                <Icon
                    icon='check'
                    className='h-5 w-5 text-theme-primary-700 dark:text-theme-primary-600'
                />
            )}
        </button>
    );
};

export const AddressBookModal = ({
    addressBook,
    handleClick,
    selectedAddress,
}: {
    addressBook: Contact[];
    handleClick: (address: string) => void;
    selectedAddress?: string;
}) => {
    return (
        <div className='custom-scroll max-h-[330px] overflow-y-auto overflow-x-hidden'>
            {addressBook.map((contact: Contact, index) => {
                return (
                    <ContactItem
                        key={index}
                        contact={contact}
                        onSelect={(address) => handleClick(address)}
                        isSelected={selectedAddress === contact.address}
                    />
                );
            })}
        </div>
    );
};
