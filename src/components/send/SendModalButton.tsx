import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components';

const SendModalButton = ({ onClick }: { onClick: MouseEventHandler<HTMLButtonElement> }) => {
    const { t } = useTranslation();

    return (
        <Button
            variant='secondaryBlack'
            className='!h-fit !w-fit !px-3 !py-1.5 !text-sm !font-medium'
            iconTrailing='qr-code'
            iconClass='h-4 w-4'
            onClick={onClick}
        >
            {t('PAGES.SEND.QR_MODAL.UPLOAD_QR')}
        </Button>
    );
};

export default SendModalButton;
