import { TestnetIcon } from '@/components/wallet/address/Address.blocks';
import useAddressBook from '@/lib/hooks/useAddressBook';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import trimAddress from '@/lib/utils/trimAddress';
import { IconButton, Tooltip } from '@/shared/components';

const AddressBookItem = ({
    name,
    address
}: {
    name: string;
    address: string;
}) => {
    const primaryWallet = usePrimaryWallet();
    const testnetIndicator = primaryWallet?.network().isTest();

    return (
        <div className="py-3 px-4 w-full hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700 flex flex-row justify-between items-center transition-smoothEase">
            <div className='flex flex-col gap-1 '>
                <div className='flex flex-row items-center gap-1.5'>
                    <span className='text-light-black text-base font-medium leading-5 dark:text-white'>{name}</span>
                    {testnetIndicator && <TestnetIcon />}
                </div>
                <Tooltip
                    content={<span>{address}</span>}>
                    <span className='text-theme-secondary-500 text-sm font-normal dark:text-theme-secondary-300 cursor-default'>{trimAddress(address, 10)}</span>
                </Tooltip>
            </div>

            <div className='h-full flex flex-row items-end justify-center gap-0.5'>
                <IconButton icon='pencil' />
                <IconButton icon='trash' variant='danger' />
            </div>
        </div>
    );
};

export const AddressBookList = () => {
    const { getAddressBook } = useAddressBook();
    const primaryWallet = usePrimaryWallet();
    const currentAddressBook = getAddressBook(primaryWallet?.address() || '');
    
    return (
        <div className="bg-white w-full py-2 flex flex-col rounded-2xl dark:bg-subtle-black shadow-address-book overflow-hidden"> 
            {currentAddressBook.map((contact, index) => (
                <AddressBookItem key={index} name={contact.name} address={contact.address} />
            ))}
        </div>
    );
};
