import { object, string } from 'yup';
import { SendButton, SendForm } from '@/components/send';
import { useEffect, useState } from 'react';

import { BigNumber } from '@ardenthq/sdk-helpers';
import constants from '@/constants';
import { runtime } from 'webextension-polyfill';
import { ScreenName } from '@/lib/background/contracts';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { useProfileContext } from '@/lib/context/Profile';
import { useTranslation } from 'react-i18next';
import { validateAddress } from './CreateContact';
import { ValidateAddressResponse } from '@/components/address-book/types';
import { WalletNetwork } from '@/lib/store/wallet';

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
                const userBalance = primaryWallet?.balance() || 0;
                return Number(value) <= userBalance;
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
                return Number(value) < 1;
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
                        domain: 'ARK Connect',
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

    return (
        <SubPageLayout title={t('COMMON.SEND')} className='relative p-0'>
            <div className='custom-scroll h-[393px] w-full overflow-y-auto overflow-x-hidden px-4'>
                <SendForm formik={formik} />
            </div>
            <div className='w-full'>
                <SendButton disabled={!(formik.isValid && hasValues)} onClick={formik.submitForm} />
            </div>
        </SubPageLayout>
    );
};

export default Send;
