import cn from 'classnames';
import { Contact } from '@/lib/hooks/useAddressBook';
import trimAddress from '@/lib/utils/trimAddress';

const ContactItem = ({ contact, onSelect, isSelected }: {
    contact: Contact;
    onSelect: (contact: string) => void;
    isSelected: boolean;
}) => {
    return (
        <button 
            className={cn('w-[306px] h-[66px] py-3 px-4 border-b border-b-theme-secondary-200 hover:rounded-lg hover:bg-theme-secondary-50 hover:border-none flex flex-col gap-1 dark:bg-subtle-black dark:hover:bg-theme-secondary-700', {
                '': isSelected,
            })} 
            onClick={() => onSelect(contact.address)}
        >
            <span className='text-light-black text-base font-medium leading-5 dark:text-white'>{contact.name}</span>
            <span className='text-sm font-normal text-theme-secondary-500 dark:text-theme-secondary-300'>{trimAddress(contact.address, 10)}</span>
        </button>
    );
};

export const AddressBookModal = () => {
  return (
    <div>AddressBookModal</div>
  );
};
