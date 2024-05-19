import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components';

export const SendButton = ({ disabled, onClick }: { disabled: boolean; onClick: () => void }) => {
    const { t } = useTranslation();

    return (
        <div className='h-[84px] w-full bg-white p-4 shadow-button-container dark:bg-subtle-black dark:shadow-button-container-dark'>
            <Button variant='primary' disabled={disabled} onClick={onClick}>
                {t('COMMON.CONTINUE')}
            </Button>
        </div>
    );
};
