import { Button, HeadingDescription } from '@/shared/components';
import { useTranslation } from 'react-i18next';

type ConnectFooterProps = {
    onSubmit: () => Promise<void>;
    onCancel: () => Promise<void>;
};
const ConnectFooter = ({ onSubmit, onCancel }: ConnectFooterProps) => {
    const { t } = useTranslation();
    return (
        <div className='px-4'>
            <HeadingDescription className='mb-8'>
               {t('PAGES.CONNECT.CAN_SEE_YOUR_ADDRESS_DISCLAIMER')}
            </HeadingDescription>
            <div className='grid grid-cols-2 gap-2'>
                <Button variant='secondaryBlack' onClick={onCancel}>
                    {t('ACTION.REFUSE')}
                </Button>
                <Button variant='primary' onClick={onSubmit}>
                    {t('ACTION.CONNECT')}
                </Button>
            </div>
        </div>
    );
};

export default ConnectFooter;
