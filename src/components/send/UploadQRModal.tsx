import { FileUploader } from 'react-drag-drop-files';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { FormikProps } from 'formik';
import jsQR from 'jsqr';
import Modal from '@/shared/components/modal/Modal';
import { Button, Icon, Loader } from '@/shared/components';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { SendFormik } from '@/pages/Send';
import { ApproveActionType } from '@/pages/Approve';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';

export const UploadQRModal = ({
    formik,
    setIsModalOpen,
}: {
    formik: FormikProps<SendFormik>;
    setIsModalOpen: (value: boolean) => void;
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();
    const { isDark } = useThemeMode();
    const { t } = useTranslation();
    const primaryWallet = usePrimaryWallet();
    const fileTypes = ['JPG', 'JPEG', 'PNG', 'GIF'];

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleTypeError = () => {
        setError(t('ERROR.QR_CODE.INVALID_SIZE'));
    };

    const handleSizeError = () => {
        setError(t('ERROR.QR_CODE.INVALID_FORMAT'));
    };

    const handleModalError = (error: string | undefined) => {
        setError(error);
        setIsLoading(false);
    };

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const setFieldValue = (field: string, value: string | null) => {
        formik.setFieldValue(field, value);
        setTimeout(() => formik.setFieldTouched(field, true));
    };

    const handleDragAndDropChange = useCallback(async (file: File) => {
        setIsLoading(true);
        if (!file.type.startsWith('image/')) {
            handleModalError(t('ERROR.QR_CODE.INVALID_FORMAT'));
            return;
        }

        try {
            const imageData = await readFileAsDataURL(file);
            const img = new Image();
            img.src = imageData;
            img.onload = async () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (!code) {
                    handleModalError(t('ERROR.QR_CODE.NO_QR_CODE'));
                    return;
                }

                const params = new URLSearchParams(code.data.split('?')[1]);
                if (params.get('method') !== ApproveActionType.TRANSACTION) {
                    handleModalError(t('ERROR.QR_CODE.INVALID_TRANSACTION_TYPE'));
                    return;
                }

                if (
                    params.get('coin') !== primaryWallet?.network().coinName() ||
                    params.get('nethash') !== primaryWallet?.network().meta().nethash
                ) {
                    handleModalError(t('ERROR.QR_CODE.INVALID_NETWORK'));
                    return;
                }

                setFieldValue('receiverAddress', params.get('recipient'));

                ['amount', 'memo'].forEach((field) => {
                    if (params.has(field)) {
                        setFieldValue(field, params.get(field));
                    }
                });

                formik.validateForm();
                handleModalError(undefined);
                setIsModalOpen(false);
            };
        } catch (error) {
            handleModalError(t('CUSTOM_ERROR', { error }));
        }
    }, []);

    return (
        <Modal
            icon='qr-code'
            variant='danger'
            onClose={handleModalClose}
            focusTrapOptions={{
                initialFocus: false,
            }}
            iconClassName='text-theme-secondary-500 dark:text-theme-secondary-300'
            footer={
                !isLoading && (
                    <div className='grid grid-cols-2 gap-2'>
                        <Button variant='secondaryBlack' onClick={handleModalClose}>
                            {t('COMMON.CANCEL')}
                        </Button>
                        <FileUploader
                            onSelect={handleDragAndDropChange}
                            onDrop={undefined}
                            name='qr-code'
                            types={fileTypes}
                            multiple={false}
                            disabled={isLoading}
                            maxSize={5}
                            onSizeError={handleSizeError}
                            onTypeError={handleTypeError}
                            classes='focus-within:!outline-theme-primary-600 rounded-2xl'
                        >
                            <Button variant='primary' tabIndex={-1}>
                                {t('PAGES.SEND.QR_MODAL.UPLOAD_QR')}
                            </Button>
                        </FileUploader>
                    </div>
                )
            }
            errorMessage={error}
        >
            <div className='flex flex-col gap-1.5'>
                <FileUploader
                    handleChange={handleDragAndDropChange}
                    name='qr-code'
                    types={fileTypes}
                    multiple={false}
                    disabled={isLoading}
                    maxSize={5}
                    onSizeError={handleSizeError}
                    onTypeError={handleTypeError}
                    classes='focus-within:!outline-theme-primary-600 rounded-2xl'
                >
                    <div className='h-50 w-[306px] cursor-pointer rounded-2xl border border-dashed border-theme-secondary-200 bg-theme-secondary-25 dark:border-theme-secondary-600 dark:bg-theme-secondary-800'>
                        <div className='relative flex items-center justify-center overflow-hidden'>
                            <Icon
                                icon={isDark() ? 'upload-background-dark' : 'upload-background'}
                                className='mt-[3px] h-[192px] w-[298px] rounded-xl'
                            />

                            <Icon
                                icon={isDark() ? 'qr-drag-and-drop-dark' : 'qr-drag-and-drop'}
                                className='absolute top-0 h-80 w-80'
                            />

                            {isLoading && (
                                <div className='absolute mt-[3px] flex h-[192px] w-[298px] items-center justify-center rounded-xl bg-subtle-black/80 dark:bg-theme-secondary-900/70'>
                                    <Loader variant='big' className='h-16 w-16' />
                                </div>
                            )}
                        </div>
                    </div>
                </FileUploader>
                <span className='text-base font-normal leading-5 text-theme-secondary-500 dark:text-theme-secondary-300'>
                    {isLoading
                        ? t('PAGES.SEND.QR_MODAL.PROCESSING_IMAGE')
                        : t('PAGES.SEND.QR_MODAL.CHOOSE_YOUR_QR_CODE')}
                </span>
            </div>
        </Modal>
    );
};
