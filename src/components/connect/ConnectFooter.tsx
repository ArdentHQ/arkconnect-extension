import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components';

type ConnectFooterProps = {
    onSubmit: () => Promise<void>;
    onCancel: () => Promise<void>;
};
const ConnectFooter = ({ onSubmit, onCancel }: ConnectFooterProps) => {
    const { t } = useTranslation();
    return (
        <div className='px-4'>
            <p className='typeset-headline mb-8 text-theme-secondary-500 dark:text-theme-secondary-300'>
                {t('PAGES.CONNECT.CAN_SEE_YOUR_ADDRESS_DISCLAIMER')}
            </p>
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
