import { Button, HeadingTODO, Paragraph } from '@/shared/components';
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
                <HeadingTODO className=' mb-1.5' level={4}>
                    Select Network Type
                </HeadingTODO>
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
