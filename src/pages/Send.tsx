import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { validateAddress } from './CreateContact';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { SendButton, SendForm } from '@/components/send';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import constants from '@/constants';
import { ValidateAddressResponse } from '@/components/address-book/types';
import { WalletNetwork } from '@/lib/store/wallet';
import { useProfileContext } from '@/lib/context/Profile';

export type SendFormik = {
    amount?: string;
    memo?: string;
    fee: string;
    receiverAddress: string;
};

const Send = () => {
    const navigate = useNavigate();
    const primaryWallet = usePrimaryWallet();
    const { t } = useTranslation();
    const { profile } = useProfileContext();
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
                const userBalance = primaryWallet?.balance() || 0;
                return Number(value) <= userBalance;
            })
            .test(
                'total-check',
                t('ERROR.IS_EXCEEDING_BALANCE', { name: 'fee + amount' }),
                (value) => {
                    if (!value || !formik.values.fee) return true;
                    const userBalance = primaryWallet?.balance() || 0;
                    const sum: number = Number(value) + Number(formik.values.fee);
                    return sum <= userBalance;
                },
            )
            .test(
                'min-value',
                t('ERROR.IS_REQUIRED', { name: 'Amount' }),
                (value) => {
                    return Number(value) > 0;
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
                return Number(value) < 1;
            })
            .trim(),
        receiverAddress: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Address' }))
            .min(constants.ADDRESS_LENGTH, t('ERROR.IS_INVALID', { name: 'Address' }))
            .max(constants.ADDRESS_LENGTH, t('ERROR.IS_INVALID', { name: 'Address' }))
            .test('valid-address', t('ERROR.IS_INVALID', { name: 'Address' }), () => {
                return addressValidation.isValid;
            })
            .test('same-network-address', t('ERROR.IS_INVALID', { name: 'Address' }), () => {
                return (
                    addressValidation.network ===
                    (primaryWallet?.network().isTest()
                        ? WalletNetwork.DEVNET
                        : WalletNetwork.MAINNET)
                );
            })
            .trim(),
    });

    const formik = useFormik<SendFormik>({
        initialValues: {
            amount: '',
            memo: '',
            fee: '',
            receiverAddress: '',
        },
        validationSchema: validationSchema,
        onSubmit: () => {
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
                    },
                },
            });
        },
    });

    useEffect(() => {
        const handleAddressValidation = async () => {
            const response = await validateAddress({
                address: formik.values.receiverAddress,
                profile,
            });
            setAddressValidation(response);
        };

        if (
            formik.values.receiverAddress &&
            formik.values.receiverAddress.length === constants.ADDRESS_LENGTH
        ) {
            handleAddressValidation();
        }
    }, [formik.values.receiverAddress, profile]);

    return (
        <SubPageLayout title={t('COMMON.SEND')} className='relative p-0'>
            <div className='custom-scroll h-[393px] w-full overflow-y-auto px-4'>
                <SendForm formik={formik} />
            </div>
            <div className='w-full'>
                <SendButton
                    disabled={!(formik.isValid && formik.dirty)}
                    onClick={formik.submitForm}
                />
            </div>
        </SubPageLayout>
    );
};

export default Send;
