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
            <div className='grid h-full w-full grid-cols-2 items-center gap-2 bg-white px-4 py-4 shadow-button-container dark:bg-subtle-black dark:shadow-button-container-dark'>
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
