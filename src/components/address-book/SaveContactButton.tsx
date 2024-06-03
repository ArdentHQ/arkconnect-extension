import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components';
import { CommonFooter } from '@/shared/components/utils/CommonFooter';

export const SaveContactButton = ({
    disabled,
    onClick,
}: {
    disabled: boolean;
    onClick: () => void;
}) => {
    const { t } = useTranslation();
    return (
        <CommonFooter className='h-[84px]'>
            <Button variant='primary' disabled={disabled} onClick={onClick}>
                {t('COMMON.SAVE')}
            </Button>
        </CommonFooter>
    );
};
