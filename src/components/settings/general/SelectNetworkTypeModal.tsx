import { Button, Container, Heading } from '@/shared/components';
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
            <Container>
                <Heading $typeset='h4' fontWeight='medium' color='base' mb='6'>
                    Select Network Type
                </Heading>
                <Container>
                    <p className='typeset-headline mt-2 inline'>
                        Select a network to {action} your {action === 'create' ? 'new' : ''} address
                        with.
                    </p>
                </Container>
            </Container>
        </Modal>
    );
};

export default SelectNetworkTypeModal;
