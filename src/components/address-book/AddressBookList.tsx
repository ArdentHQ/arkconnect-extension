import { TestnetIcon } from '@/components/wallet/address/Address.blocks';
import useAddressBook from '@/lib/hooks/useAddressBook';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import trimAddress from '@/lib/utils/trimAddress';
import { IconButton, Tooltip } from '@/shared/components';

const AddressBookItem = ({ name, address }: { name: string; address: string }) => {
    const primaryWallet = usePrimaryWallet();
    const testnetIndicator = primaryWallet?.network().isTest();

    return (
        <div className='transition-smoothEase flex w-full flex-row items-center justify-between px-4 py-3 hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700'>
            <div className='flex flex-col gap-1 '>
                <div className='flex flex-row items-center gap-1.5'>
                    <span className='text-base font-medium leading-5 text-light-black dark:text-white'>
                        {name}
                    </span>
                    {testnetIndicator && <TestnetIcon />}
                </div>
                <Tooltip content={<span>{address}</span>}>
                    <span className='cursor-default text-sm font-normal text-theme-secondary-500 dark:text-theme-secondary-300'>
                        {trimAddress(address, 10)}
                    </span>
                </Tooltip>
            </div>

            <div className='flex h-full flex-row items-end justify-center gap-0.5'>
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
        <div className='flex w-full flex-col overflow-hidden rounded-2xl bg-white py-2 shadow-address-book dark:bg-subtle-black'>
            {currentAddressBook.map((contact, index) => (
                <AddressBookItem key={index} name={contact.name} address={contact.address} />
            ))}
        </div>
    );
};
