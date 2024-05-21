import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { generateReceiveUrl } from '@/lib/utils/generateReceiveURL';
import { Accordion, Input } from '@/shared/components';

export type SendFormik = {
    amount?: string;
    memo?: string;
};

export const QRCodeContainer = () => {
    const primaryWallet = usePrimaryWallet();
    const { t } = useTranslation();
    const { isDark } = useThemeMode();

    const [isOpen, setIsOpen] = useState(false);

    const validationSchema = object().shape({
        amount: string()
            .matches(/^[0-9]+(\.[0-9]{1,8})?$/, {
                message: t('ERROR.IS_INVALID', { name: 'Amount' }),
            })
            .test('max-integer', t('ERROR.IS_TOO_HIGH', { name: 'Amount' }), (value) => {
                if (!value) return true;
                const integerPart = Math.floor(Number(value));
                return integerPart < 100_000_000;
            }),
        memo: string().max(255, t('ERROR.IS_TOO_LONG', { name: 'Memo' })),
    });

    const formik = useFormik<SendFormik>({
        initialValues: {
            amount: '',
            memo: '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {},
    });

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1.5'>
                <span className='text-sm font-medium text-theme-secondary-500 dark:text-theme-secondary-200'>
                    {t('COMMON.QR_CODE')}
                </span>
                <div className='flex w-full items-center justify-center rounded-lg border border-theme-secondary-200 bg-white px-3 py-4 dark:border-theme-secondary-600 dark:bg-theme-secondary-800 dark:text-theme-secondary-400 dark:shadow-secondary-dark'>
                    <QRCode
                        value={generateReceiveUrl({
                            coinName: primaryWallet?.network().coinName() ?? 'ARK',
                            netHash: primaryWallet?.network().meta().nethash,
                            address: primaryWallet?.address() ?? '',
                            amount:
                                !formik.errors.amount && formik.values.amount !== undefined
                                    ? formik.values.amount
                                    : undefined,
                            memo:
                                !formik.errors.memo && formik.values.memo !== undefined
                                    ? formik.values.memo
                                    : undefined,
                        })}
                        size={200}
                        bgColor={'#fff'}
                        fgColor={'#000'}
                        className='dark:rounded-md dark:bg-white dark:p-2'
                    />
                </div>
                <span className='text-sm font-normal text-theme-secondary-500 dark:text-theme-secondary-300'>
                    {t('PAGES.RECEIVE.QR_CODE_WILL_BE_UPDATED_AUTOMATICALLY')}
                </span>
            </div>

            <hr className='text-theme-secondary-200 dark:text-theme-secondary-700' />

            <Accordion
                className='mb-4'
                title={
                    <h3 className='text-base font-normal text-light-black dark:text-white'>
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
                    <Input
                        type='text'
                        labelText={t('COMMON.MEMO')}
                        placeholder={t('COMMON.ADD_NOTE_TO_TRANSACTION')}
                        name='memo'
                        value={formik.values.memo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        variant={formik.errors.memo ? 'destructive' : 'primary'}
                        helperText={formik.errors.memo}
                        secondaryText={`${formik.values.memo !== undefined ? formik.values.memo.length : 0}/255`}
                    />
                </div>
            </Accordion>
        </div>
    );
};
