import { Contact } from '../hooks/useAddressBook';
import { WalletNetwork } from '../store/wallet';

export const seededAddressBook: Contact[] = [
    {
        name: 'Test #1',
        address: '0xA5cc0BfEB09742C5e4C610f2EBaaB82Eb142Ca10',
        type: WalletNetwork.MAINNET,
    },
    {
        name: 'Test #2',
        address: '0xb9B758e8B9f3Ed6F1eEe4f299849dCF7aC55c164',
        type: WalletNetwork.DEVNET,
    },
];
