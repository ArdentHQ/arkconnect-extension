import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components';


export const AddContactButton = () => {
  const { t } = useTranslation();
  return (
    <div className="h-[84px] w-full bg-white shadow-button-container dark:bg-subtle-black dark:shadow-button-container-dark p-4">
      <Button variant='secondary'>
        {t('PAGES.ADDRESS_BOOK.ADD_NEW_CONTACT')}
      </Button>
    </div>
  );
};
