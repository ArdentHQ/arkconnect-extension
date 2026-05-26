import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import { useRef, useState } from 'react';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { QRActionButtons } from './QRActionButtons';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { generateReceiveUrl } from '@/lib/utils/generateReceiveURL';
import { Accordion, Input } from '@/shared/components';
import constants from '@/constants';
import useClipboard from '@/lib/hooks/useClipboard';
import useToast from '@/lib/hooks/useToast';

export type SendFormik = {
    amount?: string;
};

export const QRCodeContainer = () => {
    const primaryWallet = usePrimaryWallet();
    const toast = useToast();
    const qrRef = useRef<HTMLDivElement | null>(null);
    const { t } = useTranslation();
    const { copy } = useClipboard();

    const [isOpen, setIsOpen] = useState(false);

    const validationSchema = object().shape({
        amount: string()
            .matches(constants.AMOUNT_REGEX, {
                message: t('ERROR.IS_INVALID', { name: 'Amount' }),
            })
            .test('max-integer', t('ERROR.IS_TOO_HIGH', { name: 'Amount' }), (value) => {
                if (!value) return true;
                const integerPart = Math.floor(Number(value));
                return integerPart < 100_000_000;
            }),
    });

    const formik = useFormik<SendFormik>({
        initialValues: {
            amount: '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {},
    });

    const generatedUrl = generateReceiveUrl({
        coinName: primaryWallet?.network().coinName() ?? 'ARK',
        netHash: primaryWallet?.network().meta().nethash,
        address: primaryWallet?.address() ?? '',
        amount:
            !formik.errors.amount && formik.values.amount !== undefined
                ? formik.values.amount
                : undefined,
    });

    const handleCopy = () => {
        copy(generatedUrl, t('COMMON.QR_CODE'));
    };

    const handleDownload = () => {
        if (qrRef.current) {
            toPng(qrRef.current).then((dataUrl) => {
                saveAs(dataUrl, 'qr-code.png');
            });
            toast('success', t('COMMON.HAS_BEEN_SAVED_SUCCESSFULLY', { name: 'QR Code' }));
        }
    };

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1.5'>
                <span className='text-theme-secondary-500 dark:text-theme-secondary-200 text-sm font-medium'>
                    {t('COMMON.QR_CODE')}
                </span>
                <div className='border-theme-secondary-200 dark:border-theme-secondary-600 dark:bg-theme-secondary-800 dark:text-theme-secondary-400 dark:shadow-secondary-dark flex w-full flex-col items-center justify-center gap-4 rounded-lg border bg-white px-3 py-4'>
                    <div ref={qrRef}>
                        <QRCode
                            value={generatedUrl}
                            size={200}
                            bgColor={'#fff'}
                            fgColor={'#000'}
                            className='dark:rounded-md dark:bg-white dark:p-2'
                        />
                    </div>

                    <div className='flex flex-row items-center justify-center gap-2'>
                        <QRActionButtons
                            icon='download'
                            text={t('COMMON.SAVE_WITH_NAME', { name: 'QR' })}
                            onClick={handleDownload}
                        />
                        <hr className='bg-theme-secondary-200 dark:bg-theme-secondary-600 h-5 w-px' />
                        <QRActionButtons
                            icon='copy'
                            text={t('COMMON.COPY_with_name', { name: 'QR' })}
                            onClick={handleCopy}
                        />
                    </div>
                </div>
                <span className='text-theme-secondary-500 dark:text-theme-secondary-300 text-sm font-normal'>
                    {t('PAGES.RECEIVE.QR_CODE_WILL_BE_UPDATED_AUTOMATICALLY')}
                </span>
            </div>

            <hr className='text-theme-secondary-200 dark:text-theme-secondary-700' />

            <Accordion
                className='mb-4'
                title={
                    <h3 className='text-light-black text-base font-normal dark:text-white'>
                        {t('PAGES.RECEIVE.SPECIFY_AMOUNT')}{' '}
                        <span className='text-theme-secondary-500 dark:text-theme-secondary-300'>
                            ({t('COMMON.OPTIONAL')})
                        </span>
                    </h3>
                }
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
                <div className='flex flex-col gap-4'>
                    <Input
                        type='text'
                        labelText={t('COMMON.AMOUNT')}
                        placeholder={t('COMMON.ENTER_AMOUNT')}
                        name='amount'
                        value={formik.values.amount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        variant={formik.errors.amount ? 'destructive' : 'primary'}
                        helperText={formik.errors.amount}
                    />
                </div>
            </Accordion>
        </div>
    );
};
