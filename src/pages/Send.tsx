import { object, string } from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from '@ardenthq/sdk-helpers';
import { runtime } from 'webextension-polyfill';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileUploader } from 'react-drag-drop-files';
import jsQR from 'jsqr';
import { validateAddress } from './CreateContact';
import { ApproveActionType } from './Approve';
import { SendButton, SendForm } from '@/components/send';
import { ScreenName } from '@/lib/background/contracts';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { ValidateAddressResponse } from '@/components/address-book/types';
import { WalletNetwork } from '@/lib/store/wallet';
import constants from '@/constants';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { useProfileContext } from '@/lib/context/Profile';
import SendModalButton from '@/components/send/SendModalButton';
import Modal from '@/shared/components/modal/Modal';
import { Button, Icon, Loader } from '@/shared/components';
import useThemeMode from '@/lib/hooks/useThemeMode';

export type SendFormik = {
    amount?: string;
    memo?: string;
    fee: string;
    receiverAddress: string;
};

interface PageData extends SendFormik {
    type?: string;
    session?: {
        walletId: string;
        logo: string;
        domain: string;
    };
}

const Send = () => {
    const navigate = useNavigate();
    const primaryWallet = usePrimaryWallet();
    const { t } = useTranslation();
    const { profile } = useProfileContext();
    const { isDark } = useThemeMode();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isModalLoading, setIsModalLoading] = useState<boolean>(false);
    const [modalError, setModalError] = useState<string | undefined>();

    const lastVisitedPage = profile.settings().get('LAST_VISITED_PAGE') as { data: PageData };

    if (lastVisitedPage?.data && lastVisitedPage.data.type === 'transfer') {
        navigate('/approve', {
            state: {
                type: 'transfer',
                amount: Number(lastVisitedPage.data.amount),
                memo: lastVisitedPage.data.memo,
                fee: Number(lastVisitedPage.data.fee),
                receiverAddress: lastVisitedPage.data.receiverAddress,
                session: lastVisitedPage.data.session,
            },
        });
    }

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [addressValidation, setAddressValidation] = useState<ValidateAddressResponse>({
        isValid: false,
        network: WalletNetwork.MAINNET,
    });

    const validationSchema = object().shape({
        amount: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Amount' }))
            .matches(constants.AMOUNT_REGEX, {
                message: t('ERROR.IS_INVALID', { name: 'Amount' }),
            })
            .test('max-balance', t('ERROR.BALANCE_TOO_LOW'), (value) => {
                if (!value) return true;
                const userBalance = BigNumber.make(primaryWallet?.balance() || 0);
                return BigNumber.make(value).isLessThanOrEqualTo(userBalance);
            })
            .test(
                'total-check',
                t('ERROR.IS_EXCEEDING_BALANCE', { name: 'fee + amount' }),
                (value) => {
                    if (!value || !formik.values.fee) return true;
                    const userBalance = BigNumber.make(primaryWallet?.balance() || 0);
                    const sum: BigNumber = BigNumber.make(value).plus(
                        BigNumber.make(formik.values.fee),
                    );
                    return sum.isLessThanOrEqualTo(userBalance);
                },
            )
            .trim(),
        memo: string().max(255, t('ERROR.IS_TOO_LONG', { name: 'Memo' })),
        fee: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Fee' }))
            .matches(constants.AMOUNT_REGEX, {
                message: t('ERROR.IS_INVALID', { name: 'Fee' }),
            })
            .test('min-value', t('ERROR.IS_REQUIRED', { name: 'Fee' }), (value) => {
                return Number(value) > 0;
            })
            .test('max-value', t('ERROR.IS_TOO_HIGH', { name: 'Fee' }), (value) => {
                return Number(value) <= constants.MAX_FEES.transfer;
            })
            .trim(),
        receiverAddress: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Address' }))
            .min(
                constants.ADDRESS_LENGTH,
                t('ERROR.IS_INVALID_ADDRESS_LENGTH', { name: 'Address' }),
            )
            .max(
                constants.ADDRESS_LENGTH,
                t('ERROR.IS_INVALID_ADDRESS_LENGTH', { name: 'Address' }),
            )
            .test('valid-address', t('ERROR.IS_INVALID', { name: 'Address' }), () => {
                if (isLoading) return true;
                return addressValidation.isValid;
            })
            .test(
                'same-network-address',
                t('ERROR.IS_INVALID_NETWORK', { name: 'Address' }),
                () => {
                    if (isLoading) return true;
                    return (
                        addressValidation.network ===
                        (primaryWallet?.network().isTest()
                            ? WalletNetwork.DEVNET
                            : WalletNetwork.MAINNET)
                    );
                },
            )
            .trim(),
    });

    const formik = useFormik<SendFormik>({
        initialValues: {
            amount: lastVisitedPage?.data?.amount || '',
            memo: lastVisitedPage?.data?.memo || '',
            fee: lastVisitedPage?.data?.fee || '',
            receiverAddress: lastVisitedPage?.data?.receiverAddress || '',
        },
        validationSchema: validationSchema,
        validateOnMount: true,
        onSubmit: () => {
            runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
            profile.settings().forget('LAST_VISITED_PAGE');
            formik.resetForm();
            setAddressValidation({ isValid: false, network: WalletNetwork.MAINNET });
            navigate('/approve', {
                state: {
                    type: 'transfer',
                    amount: Number(formik.values.amount),
                    memo: formik.values.memo,
                    fee: Number(formik.values.fee),
                    receiverAddress: formik.values.receiverAddress,
                    session: {
                        walletId: primaryWallet?.id(),
                        logo: 'icon/128.png',
                        domain: constants.APP_NAME,
                    },
                },
            });
        },
    });

    useEffect(() => {
        setIsLoading(true);

        const handleAddressValidation = async () => {
            const response = await validateAddress({
                address: formik.values.receiverAddress,
                profile,
            });
            setAddressValidation(response);
            setIsLoading(false);
        };

        if (
            formik.values.receiverAddress &&
            formik.values.receiverAddress.length === constants.ADDRESS_LENGTH
        ) {
            handleAddressValidation();
        }
    }, [formik.values.receiverAddress, profile]);

    useEffect(() => {
        runtime.sendMessage({
            type: 'SET_LAST_SCREEN',
            path: ScreenName.SendTransfer,
            data: formik.values,
        });

        return () => {
            runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
            profile.settings().forget('LAST_VISITED_PAGE');
        };
    }, [formik.values]);

    const hasValues = formik.values.amount && formik.values.receiverAddress && formik.values.fee;

    const handleModalClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const fileTypes = ['JPG', 'JPEG', 'PNG', 'GIF'];
    const handleTypeError = () => {
        setModalError(t('ERROR.QR_CODE.INVALID_SIZE'));
    };

    const handleSizeError = () => {
        setModalError(t('ERROR.QR_CODE.INVALID_FORMAT'));
    };

    const handleModalError = (error: string | undefined) => {
        setModalError(error);
        setIsModalLoading(false);
    };

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleDragAndDropChange = useCallback(async (file: File) => {
        setIsModalLoading(true);
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

                formik.setFieldValue('receiverAddress', params.get('recipient'));
                ['amount', 'memo'].forEach((field) => {
                    if (params.has(field)) {
                        formik.setFieldValue(field, params.get(field));
                    }
                });

                handleModalError(undefined);
                setIsModalOpen(false);
            };
        } catch (error) {
            handleModalError(t('CUSTOM_ERROR', { error }));
        }
    }, []);

    return (
        <SubPageLayout
            title={t('COMMON.SEND')}
            className='relative p-0'
            footer={
                <SendButton disabled={!(formik.isValid && hasValues)} onClick={formik.submitForm} />
            }
            sideButton={<SendModalButton onClick={handleModalClick} />}
        >
            <SendForm formik={formik} />

            {isModalOpen && (
                <Modal
                    icon={'qr-code'}
                    variant='danger'
                    onClose={handleModalClose}
                    focusTrapOptions={{
                        initialFocus: false,
                    }}
                    iconClassName='text-theme-secondary-500 dark:text-theme-secondary-300'
                    footer={
                        !isModalLoading && (
                            <div className='flex flex-row gap-2'>
                                <Button variant='secondaryBlack' onClick={handleModalClose}>
                                    {t('COMMON.CANCEL')}
                                </Button>
                                <Button variant='primary'>
                                    {t('PAGES.SEND.QR_MODAL.UPLOAD_QR')}
                                </Button>
                            </div>
                        )
                    }
                    errorMessage={modalError}
                >
                    <div className='flex flex-col gap-1.5'>
                        <FileUploader
                            handleChange={handleDragAndDropChange}
                            name='qr-code'
                            types={fileTypes}
                            multiple={false}
                            disabled={isModalLoading}
                            maxSize={5}
                            onSizeError={handleSizeError}
                            onTypeError={handleTypeError}
                        >
                            <div className='h-50 w-[306px] rounded-2xl border border-dashed border-theme-secondary-200 bg-theme-secondary-25 dark:border-theme-secondary-600 dark:bg-theme-secondary-800'>
                                <div className='relative flex items-center justify-center overflow-hidden'>
                                    <Icon
                                        icon={
                                            isDark()
                                                ? 'upload-background-dark'
                                                : 'upload-background'
                                        }
                                        className='mt-[3px] h-[192px] w-[298px] rounded-xl'
                                    />

                                    <Icon
                                        icon={
                                            isDark() ? 'qr-drag-and-drop-dark' : 'qr-drag-and-drop'
                                        }
                                        className='absolute top-0 h-80 w-80'
                                    />

                                    {isModalLoading && (
                                        <div className='absolute mt-[3px] flex h-[192px] w-[298px] items-center justify-center rounded-xl bg-subtle-black/80 dark:bg-theme-secondary-900/70'>
                                            <Loader variant='big' className='h-16 w-16' />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FileUploader>
                        <span className='text-base font-normal leading-5 text-theme-secondary-500 dark:text-theme-secondary-300'>
                            {isModalLoading
                                ? t('PAGES.SEND.QR_MODAL.PROCESSING_IMAGE')
                                : t('PAGES.SEND.QR_MODAL.CHOOSE_YOUR_QR_CODE')}
                        </span>
                    </div>
                </Modal>
            )}
        </SubPageLayout>
    );
};

export default Send;
