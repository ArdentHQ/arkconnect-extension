import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components';
import { Footer } from '@/shared/components/layout/Footer';

export const AddContactButton = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Footer className='h-[84px]'>
            <Button onClick={() => navigate('/address-book/create')} variant='secondary'>
                {t('PAGES.ADDRESS_BOOK.ADD_NEW_CONTACT')}
            </Button>
        </Footer>
    );
};
