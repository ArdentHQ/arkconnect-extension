import { useTranslation } from 'react-i18next';
import { Button, HeadingDescription } from '@/shared/components';

type ConnectFooterProps = {
    onSubmit: () => Promise<void>;
    onCancel: () => Promise<void>;
};
const ConnectFooter = ({ onSubmit, onCancel }: ConnectFooterProps) => {
    const { t } = useTranslation();
    return (
        <div>
            <HeadingDescription className='mb-6 px-4'>
                {t('PAGES.CONNECT.CAN_SEE_YOUR_ADDRESS_DISCLAIMER')}
            </HeadingDescription>
            <div className='grid grid-cols-2 gap-2 px-4 w-full h-full items-center dark:bg-subtle-black shadow-button-container dark:shadow-button-container-dark bg-white py-4'>
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
