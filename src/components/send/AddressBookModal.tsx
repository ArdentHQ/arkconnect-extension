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
                    'bg-theme-primary-50 dark:bg-theme-primary-800/25 rounded-lg': isSelected,
                    'dark:bg-light-black-black border-b-theme-secondary-200 hover:bg-theme-secondary-50 dark:border-b-theme-secondary-700 dark:hover:bg-theme-secondary-700 border-b hover:rounded-lg hover:border-transparent':
                        !isSelected,
                },
            )}
            onClick={() => onSelect(contact.address)}
        >
            <span className='flex flex-col items-start gap-1'>
                <span className='text-light-black text-base leading-5 font-medium dark:text-white'>
                    {contact.name}
                </span>
                <span className='text-theme-secondary-500 dark:text-theme-secondary-300 text-sm font-normal'>
                    {trimAddress(contact.address, 10)}
                </span>
            </span>
            {isSelected && (
                <Icon
                    icon='check'
                    className='text-theme-primary-700 dark:text-theme-primary-600 h-5 w-5'
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
        <div className='custom-scroll max-h-[330px] overflow-x-hidden overflow-y-auto'>
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
