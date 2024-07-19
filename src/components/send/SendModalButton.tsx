import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Tooltip } from '@/shared/components';
import { isFirefox } from '@/lib/utils/isFirefox';

const SendModalButton = ({ onClick }: { onClick: MouseEventHandler<HTMLButtonElement> }) => {
    const { t } = useTranslation();

    return (
        <Tooltip content={t('PAGES.SEND.QR_MODAL.FIREFOX_NOT_SUPPORTED')} disabled={!isFirefox} className='w-60'>
            <div>
                <Button
                    variant='secondaryBlack'
                    className='!h-fit !w-fit !px-3 !py-1.5 !text-sm !font-medium'
                    iconTrailing='qr-code'
                    iconClass='h-4 w-4'
                    onClick={onClick} 
                    disabled={isFirefox}
                >
                    {t('PAGES.SEND.QR_MODAL.UPLOAD_QR')}
                </Button>
            </div> 
        </Tooltip>
    );
};

export default SendModalButton;
