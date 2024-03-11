import { Button, Heading, Paragraph } from '@/shared/components';
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
                <Heading $typeset='h4' fontWeight='medium' color='base' mb='6'>
                    Select Network Type
                </Heading>
                <div>
                    <Paragraph
                        $typeset='headline'
                        fontWeight='regular'
                        color='gray'
                        mt='8'
                        display='inline'
                    >
                        Select a network to {action} your {action === 'create' ? 'new' : ''} address
                        with.
                    </Paragraph>
                </div>
            </div>
        </Modal>
    );
};

export default SelectNetworkTypeModal;
