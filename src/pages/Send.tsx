import { object, string } from 'yup';
import { useEffect, useState } from 'react';
import { runtime } from 'webextension-polyfill';
import { useFormik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { validateAddress } from './CreateContact';
import { BigNumber } from '@/lib/helpers';
import { SendButton, SendForm } from '@/components/send';
import { ScreenName } from '@/lib/background/contracts';
import SubPageLayout from '@/components/settings/SubPageLayout';
import constants from '@/constants';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { useProfileContext } from '@/lib/context/Profile';
import SendModalButton from '@/components/send/SendModalButton';
import { UploadQRModal } from '@/components/send/UploadQRModal';
import { calculateGasFee } from '@/lib/hooks/useNetworkFees';
import { FeeLimits } from '@/components/fees';

export type SendFormik = {
    amount?: string;
    memo?: string;
    gasPrice: string;
    gasLimit: string;
    receiverAddress: string;
    feeClass?: string;
    errors?: any;
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
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [searchParams] = useSearchParams();

    const lastVisitedPage = profile.settings().get('LAST_VISITED_PAGE') as { data: PageData };

    if (lastVisitedPage?.data && lastVisitedPage.data.type === 'transfer') {
        navigate('/approve', {
            state: {
                type: 'transfer',
                amount: lastVisitedPage.data.amount,
                memo: lastVisitedPage.data.memo,
                gasPrice: lastVisitedPage.data.gasPrice,
                gasLimit: lastVisitedPage.data.gasLimit,
                receiverAddress: lastVisitedPage.data.receiverAddress,
                session: lastVisitedPage.data.session,
            },
        });
    }

    const [isValidAddress, setIsValidAddress] = useState<boolean>(true);

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
                    if (!value || !formik.values.gasLimit || !formik.values.gasPrice) return true;
                    const userBalance = BigNumber.make(primaryWallet?.balance() || 0);
                    const fee = calculateGasFee(formik.values.gasPrice, formik.values.gasLimit);

                    const sum: BigNumber = BigNumber.make(value).plus(BigNumber.make(fee));
                    return sum.isLessThanOrEqualTo(userBalance);
                },
            )
            .trim(),
        gasPrice: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Gas Price' }))
            .test('min-value', t('ERROR.IS_REQUIRED', { name: 'Gas Price' }), (value) => {
                return BigNumber.make(value).isGreaterThanOrEqualTo(FeeLimits.gasPrice[0]);
            })
            .test('max-value', t('ERROR.IS_TOO_HIGH', { name: 'Gas Price' }), (value) => {
                return BigNumber.make(value).isLessThanOrEqualTo(FeeLimits.gasPrice[1]);
            })
            .trim(),
        gasLimit: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Gas Limit' }))
            .test('min-value', t('ERROR.IS_REQUIRED', { name: 'Gas Limit' }), (value) => {
                return BigNumber.make(value).isGreaterThanOrEqualTo(FeeLimits.gasLimit[0]);
            })
            .test('max-value', t('ERROR.IS_TOO_HIGH', { name: 'Gas Limit' }), (value) => {
                return BigNumber.make(value).isLessThanOrEqualTo(FeeLimits.gasLimit[1]);
            })
            .trim(),
        feeClass: string().oneOf([
            constants.FEE_CUSTOM,
            constants.FEE_AVERAGE,
            constants.FEE_FAST,
            constants.FEE_SLOW,
        ]),
        receiverAddress: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Address' }))
            .test('valid-address', t('ERROR.IS_INVALID', { name: 'Address' }), () => {
                return isValidAddress;
            })
            .trim(),
    });

    const formik = useFormik<SendFormik>({
        initialValues: {
            amount: lastVisitedPage?.data?.amount || '',
            memo: lastVisitedPage?.data?.memo || '',
            gasPrice: lastVisitedPage?.data?.gasPrice || '',
            gasLimit: lastVisitedPage?.data?.gasLimit || '',
            feeClass:
                searchParams.get('feeClass') ||
                lastVisitedPage?.data?.feeClass ||
                constants.FEE_AVERAGE,
            receiverAddress: lastVisitedPage?.data?.receiverAddress || '',
        },
        validationSchema: validationSchema,
        validateOnMount: true,
        onSubmit: (values, formikHelpers) => {
            runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
            profile.settings().forget('LAST_VISITED_PAGE');
            formikHelpers.resetForm();
            setIsValidAddress(false);
            navigate('/approve', {
                state: {
                    type: 'transfer',
                    amount: values.amount,
                    gasPrice: values.gasPrice,
                    gasLimit: values.gasLimit,
                    receiverAddress: values.receiverAddress,
                    session: {
                        walletId: primaryWallet?.id(),
                        logo: 'icon/128.png',
                        domain: constants.APP_NAME,
                    },
                    feeClass: values.feeClass,
                },
            });
        },
    });

    const { receiverAddress, gasLimit, gasPrice, amount } = formik.values;

    useEffect(() => {
        if (receiverAddress) {
            const response = validateAddress({
                address: receiverAddress,
            });
            setIsValidAddress(response);
        }
    }, [formik.values.receiverAddress, profile]);

    useEffect(() => {
        runtime.sendMessage({
            type: 'SET_LAST_SCREEN',
            path: ScreenName.SendTransfer,
            data: { errors: formik.errors, ...formik.values },
        });

        return () => {
            runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
            profile.settings().forget('LAST_VISITED_PAGE');
        };
    }, [formik.values]);

    const hasValues = amount && receiverAddress && gasPrice && gasLimit;

    const handleModalClick = () => {
        setIsModalOpen(true);
    };

    useEffect(() => {
        const { data } = lastVisitedPage || {};
        if (data?.errors && Object.keys(data.errors).length > 0) {
            formik.setErrors(data.errors);
            Object.entries(data.errors).forEach(([key]) => {
                formik.setFieldTouched(key, true);
            });
        }
    }, [lastVisitedPage, formik.setFieldTouched, formik.setErrors]);

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

            {isModalOpen && <UploadQRModal formik={formik} setIsModalOpen={setIsModalOpen} />}
        </SubPageLayout>
    );
};

export default Send;
