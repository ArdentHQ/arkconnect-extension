import { Button, Heading, HeadingDescription } from '@/shared/components';
import Modal from '@/shared/components/modal/Modal';

type Props = {
    action?: 'create' | 'import';
    onClose: () => void;
    onNetworkSelect: (isTestnet: boolean) => void;
};

const SelectNetworkTypeModal = ({ onNetworkSelect, onClose, action = 'create' }: Props) => {
    return (
        <Modal
            onClose={onClose}
            icon='code'
            footer={
                <div className='flex items-center gap-2'>
                    <Button variant='secondary' onClick={() => onNetworkSelect(true)}>
                        Testnet
                    </Button>
                    <Button variant='primary' onClick={() => onNetworkSelect(false)}>
                        Mainnet
                    </Button>
                </div>
            }
            focusTrapOptions={{
                initialFocus: false,
            }}
        >
            <div>
                <Heading className=' mb-1.5' level={4}>
                    Select Network Type
                </Heading>
                <div>
                    <HeadingDescription className='mt-2'>
                        Select a network to {action} your {action === 'create' ? 'new' : ''} address
                        with.
                    </HeadingDescription>
                </div>
            </div>
        </Modal>
    );
};

export default SelectNetworkTypeModal;
