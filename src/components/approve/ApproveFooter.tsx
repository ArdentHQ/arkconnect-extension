import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/components';

type Props = {
    disabled?: boolean;
    onSubmit: () => Promise<void>;
    onCancel: () => Promise<void>;
    isNative?: boolean;
};

const ApproveFooter = ({ disabled, onSubmit, onCancel, isNative }: Props) => {
    const { t } = useTranslation();
    const onApprove = async () => {
        if (disabled) return;

        await onSubmit();
    };

    return (
        <div className='grid h-full w-full grid-cols-2 items-center gap-2 bg-white px-4 py-4 shadow-button-container dark:bg-subtle-black dark:shadow-button-container-dark'>
            <Button variant='secondaryBlack' onClick={onCancel}>
                {isNative ? t('ACTION.BACK') : t('ACTION.REFUSE')}
            </Button>
            <Button variant='primary' disabled={disabled} onClick={onApprove}>
                {t('ACTION.APPROVE')}
            </Button>
        </div>
    );
};

export default ApproveFooter;
