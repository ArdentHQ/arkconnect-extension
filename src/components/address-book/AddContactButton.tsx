import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components';
import { CommonFooter } from '@/shared/components/utils/CommonFooter';

export const AddContactButton = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <CommonFooter className='h-[84px]'>
            <Button onClick={() => navigate('/address-book/create')} variant='secondary'>
                {t('PAGES.ADDRESS_BOOK.ADD_NEW_CONTACT')}
            </Button>
        </CommonFooter>
    );
};
