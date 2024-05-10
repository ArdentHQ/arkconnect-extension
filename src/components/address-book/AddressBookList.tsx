import { useEffect, useRef, useState } from 'react';
import { TestnetIcon } from '@/components/wallet/address/Address.blocks';
import useAddressBook from '@/lib/hooks/useAddressBook';
import { WalletNetwork } from '@/lib/store/wallet';
import trimAddress from '@/lib/utils/trimAddress';
import { IconButton, Tooltip } from '@/shared/components';

const AddressBookItem = ({
    name,
    address,
    network,
}: {
    name: string;
    address: string;
    network: WalletNetwork;
}) => {
    const nameRef = useRef<HTMLSpanElement>(null);
    const [displayTooltip, setDisplayTooltip] = useState<boolean>(false);

    useEffect(() => {
        const textElement = nameRef.current;

        if (textElement) {
            if (textElement.scrollWidth > textElement.offsetWidth) {
                setDisplayTooltip(true);
            } else {
                setDisplayTooltip(false);
            }
        }
    }, [name]);

    return (
        <div className='transition-smoothEase flex w-full flex-row items-center justify-between px-4 py-3 hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700'>
            <div className='flex flex-col gap-1 '>
                <div className='flex flex-row items-center gap-1.5'>
                    <Tooltip content={<span>{name}</span>} disabled={!displayTooltip}>
                        <span
                            ref={nameRef}
                            className='max-w-50 overflow-hidden text-ellipsis text-base font-medium leading-5 text-light-black dark:text-white'
                        >
                            {name}
                        </span>
                    </Tooltip>
                    {network === WalletNetwork.DEVNET && <TestnetIcon />}
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
    const { addressBook } = useAddressBook();

    return (
        <div className='flex w-full flex-col overflow-hidden rounded-2xl bg-white py-2 shadow-address-book dark:bg-subtle-black'>
            {addressBook.map((contact, index) => (
                <AddressBookItem
                    key={index}
                    name={contact.name}
                    address={contact.address}
                    network={contact.type}
                />
            ))}
        </div>
    );
};
