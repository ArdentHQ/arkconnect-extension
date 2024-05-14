import cn from 'classnames';
import { Contact } from '@/lib/hooks/useAddressBook';
import trimAddress from '@/lib/utils/trimAddress';
import { Icon } from '@/shared/components';

const ContactItem = ({ contact, onSelect, isSelected }: {
    contact: Contact;
    onSelect: (contact: string) => void;
    isSelected: boolean;
}) => {
    return (
        <button 
            className={cn('w-[306px] h-[66px] py-3 px-4 flex flex-row justify-between items-center transition-smoothEase', {
                'rounded-lg bg-theme-primary-50 dark:bg-theme-primary-800/25': isSelected,
                'border-b border-b-theme-secondary-200 hover:rounded-lg hover:bg-theme-secondary-50 dark:bg-light-black-black dark:hover:bg-theme-secondary-700 dark:border-b-theme-secondary-700 hover:border-transparent': !isSelected,
            })} 
            onClick={() => onSelect(contact.address)}
        >
            <span className='flex flex-col gap-1 items-start'>
                <span className='text-light-black text-base font-medium leading-5 dark:text-white'>{contact.name}</span>
                <span className='text-sm font-normal text-theme-secondary-500 dark:text-theme-secondary-300'>{trimAddress(contact.address, 10)}</span>
            </span>
            {
                isSelected && <Icon icon='check' className='w-5 h-5 text-theme-primary-700 dark:text-theme-primary-600' />
            }
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
        <div className='max-h-[330px] overflow-y-auto custom-scroll overflow-x-hidden'>
            {
                addressBook.map((contact: Contact, index) => {
                    return (
                        <ContactItem 
                            key={index}
                            contact={contact}
                            onSelect={(address) => handleClick(address)}
                            isSelected={selectedAddress === contact.address}
                        />
                    );
                })
            }
        </div>
    );
};
