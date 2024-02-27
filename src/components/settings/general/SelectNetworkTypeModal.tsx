import { Container, FlexContainer, Heading, Paragraph, Button } from '@/shared/components';
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
                <FlexContainer alignItems='center' gridGap='8px'>
                    <Button variant='secondary' onClick={() => onNetworkSelect(true)}>
                        Testnet
                    </Button>
                    <Button variant='primary' onClick={() => onNetworkSelect(false)}>
                        Mainnet
                    </Button>
                </FlexContainer>
            }
            focusTrapOptions={{
                initialFocus: false
            }}
        >
            <Container>
                <Heading $typeset='h4' fontWeight='medium' color='base' mb='6'>
                    Select Network Type
                </Heading>
                <Container>
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
                </Container>
            </Container>
        </Modal>
    );
};

export default SelectNetworkTypeModal;
