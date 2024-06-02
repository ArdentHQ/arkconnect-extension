import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components';

type Props = {
    disabled?: boolean;
    onSubmit: () => Promise<void>;
    onCancel: () => Promise<void>;
};

const ApproveFooter = ({ disabled, onSubmit, onCancel }: Props) => {
    const { t } = useTranslation();
    const onApprove = async () => {
        if (disabled) return;

        await onSubmit();
    };

    return (
        <div className='grid grid-cols-2 gap-2 px-4 w-full h-full items-center dark:bg-subtle-black shadow-button-container dark:shadow-button-container-dark bg-white py-4'>
            <Button variant='secondaryBlack' onClick={onCancel}>
                {t('ACTION.REFUSE')}
            </Button>
            <Button variant='primary' disabled={disabled} onClick={onApprove}>
                {t('ACTION.APPROVE')}
            </Button>
        </div>
    );
};

export default ApproveFooter;
