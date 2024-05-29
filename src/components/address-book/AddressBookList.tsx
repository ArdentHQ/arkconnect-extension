import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastPosition } from '../toast/ToastContainer';
import { TestnetIcon } from '@/components/wallet/address/Address.blocks';
import { Contact } from '@/lib/hooks/useAddressBook';
import { WalletNetwork } from '@/lib/store/wallet';
import trimAddress from '@/lib/utils/trimAddress';
import { Icon, IconButton, Tooltip } from '@/shared/components';
import useClipboard from '@/lib/hooks/useClipboard';

const AddressBookItem = ({
    name,
    address,
    network,
    handleRemoveContact,
}: {
    name: string;
    address: string;
    network: WalletNetwork;
    handleRemoveContact: (name: string) => void;
}) => {
    const navigate = useNavigate();
    const nameRef = useRef<HTMLSpanElement>(null);
    const { copy } = useClipboard();
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

    const trimmedAddress = trimAddress(address, 10);
    return (
        <div className='transition-smoothEase flex w-full flex-row items-center justify-between px-4 py-3 hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700'>
            <div className='flex flex-col gap-1'>
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
                    <span className='flex cursor-default flex-row gap-0.5 text-sm font-normal text-theme-secondary-500 dark:text-theme-secondary-300'>
                        {trimmedAddress}
                        <span
                            className='flex h-5 w-5 cursor-pointer items-center justify-center'
                            onClick={() => {
                                copy(address, trimmedAddress, ToastPosition.LOWER);
                            }}
                        >
                            <Icon icon='copy' className='h-[13px] w-[13px]' />
                        </span>
                    </span>
                </Tooltip>
            </div>

            <div className='flex h-full flex-row items-end justify-center gap-0.5'>
                <IconButton
                    onClick={() => navigate(`/address-book/edit/${encodeURIComponent(name)}`)}
                    icon='pencil'
                />
                <IconButton
                    onClick={() => handleRemoveContact(name)}
                    icon='trash'
                    variant='danger'
                />
            </div>
        </div>
    );
};

export const AddressBookList = ({
    handleRemoveContact,
    addressBook,
}: {
    handleRemoveContact: (name: string) => void;
    addressBook: Contact[];
}) => {
    return (
        <div className='flex w-full flex-col overflow-hidden rounded-2xl bg-white py-2 shadow-address-book dark:bg-subtle-black'>
            {addressBook.map((contact, index) => (
                <AddressBookItem
                    key={index}
                    name={contact.name}
                    address={contact.address}
                    network={contact.type}
                    handleRemoveContact={handleRemoveContact}
                />
            ))}
        </div>
    );
};
