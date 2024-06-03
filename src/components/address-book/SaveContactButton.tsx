import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components';
import { Footer } from '@/shared/components/layout/Footer';

export const SaveContactButton = ({
    disabled,
    onClick,
}: {
    disabled: boolean;
    onClick: () => void;
}) => {
    const { t } = useTranslation();
    return (
        <Footer className='h-[84px]'>
            <Button variant='primary' disabled={disabled} onClick={onClick}>
                {t('COMMON.SAVE')}
            </Button>
        </Footer>
    );
};
