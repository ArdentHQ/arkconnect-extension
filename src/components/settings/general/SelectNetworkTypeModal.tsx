import { useTranslation } from 'react-i18next';
import { Button, Heading, HeadingDescription } from '@/shared/components';
import Modal from '@/shared/components/modal/Modal';

type Props = {
    action?: 'create' | 'import';
    onClose: () => void;
    onNetworkSelect: (isTestnet: boolean) => void;
};

const SelectNetworkTypeModal = ({ onNetworkSelect, onClose, action = 'create' }: Props) => {
    const { t } = useTranslation();
    return (
        <Modal
            onClose={onClose}
            icon='code'
            footer={
                <div className='flex items-center gap-2'>
                    <Button variant='secondary' onClick={() => onNetworkSelect(true)}>
                        {t('COMMON.TESTNET')}
                    </Button>
                    <Button variant='primary' onClick={() => onNetworkSelect(false)}>
                        {t('COMMON.MAINNET')}
                    </Button>
                </div>
            }
            focusTrapOptions={{
                initialFocus: false,
            }}
        >
            <div>
                <Heading className='mb-1.5' level={4}>
                    {t('PAGES.SETTINGS.SELECT_NETWORK_TYPE')}
                </Heading>
                <div>
                    <HeadingDescription className='mt-2'>
                        {action === 'create'
                            ? t('PAGES.SETTINGS.SELECT_NETWORK_TO_CREATE')
                            : t('PAGES.SETTINGS.SELECT_NETWORK_TO_IMPORT')}
                    </HeadingDescription>
                </div>
            </div>
        </Modal>
    );
};

export default SelectNetworkTypeModal;
