import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { BigNumber } from '@ardenthq/sdk-helpers';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { useDelegates } from '@/lib/hooks/useDelegates';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { useProfileContext } from '@/lib/context/Profile';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { assertWallet } from '@/lib/utils/assertions';
import { DelegatesList } from '@/components/vote/DelegatesList';
import { VoteButton } from '@/components/vote/VoteButton';
import { DelegatesSearchInput } from '@/components/vote/DelegatesSearchInput';
import constants from '@/constants';
import { Footer } from '@/shared/components/layout/Footer';
import { VoteFee } from '@/components/vote/VoteFee';

export type VoteFormik = {
    delegateAddress: string;
    fee: string;
};

const Vote = () => {
    const { t } = useTranslation();
    const { profile } = useProfileContext();
    const { env } = useEnvironmentContext();
    const wallet = usePrimaryWallet();

    assertWallet(wallet);

    const delegatesPerPage = useMemo(() => wallet.network().delegateCount(), [wallet]);

    const [searchQuery, setSearchQuery] = useState<string>('');

    const { delegates, fetchDelegates, fetchVotes, currentVotes, isLoadingDelegates } =
        useDelegates({
            env,
            profile,
        });

    useEffect(() => {
        fetchDelegates(wallet);

        fetchVotes(wallet.address(), wallet.network().id());
    }, [wallet]);

    const validationSchema = object().shape({
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
        delegateAddress: string()
            .required(t('ERROR.IS_REQUIRED', { name: 'Delegate' }))
            .min(
                constants.ADDRESS_LENGTH,
                t('ERROR.IS_INVALID_ADDRESS_LENGTH', { name: 'Address' }),
            )
            .max(
                constants.ADDRESS_LENGTH,
                t('ERROR.IS_INVALID_ADDRESS_LENGTH', { name: 'Address' }),
            ),
    });

    const formik = useFormik<VoteFormik>({
        initialValues: {
            fee: '',
            delegateAddress: '',
        },
        validationSchema: validationSchema,
        validateOnMount: true,
        onSubmit: () => {},
    });

    const hasValues = formik.values.delegateAddress && formik.values.fee;
    const hasSufficientFunds = BigNumber.make(wallet.balance()) > BigNumber.make(formik.values.fee);

    return (
        <SubPageLayout
            title={t('PAGES.VOTE.VOTE')}
            footer={
                <Footer className='space-y-4'>
                    <VoteFee
                        delegateAddress={formik.values.delegateAddress}
                        fee={formik.values.fee}
                        onSelectedFee={(fee) => formik.setFieldValue('fee', fee)}
                        onBlur={formik.handleBlur}
                        feeError={formik.errors.fee}
                    />

                    <VoteButton
                        onClick={formik.submitForm}
                        delegateAddress={formik.values.delegateAddress}
                        votes={currentVotes}
                        disabled={!(formik.isValid && hasValues && hasSufficientFunds)}
                        displayTooltip={hasSufficientFunds}
                    />
                </Footer>
            }
        >
            <DelegatesSearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <DelegatesList
                onDelegateSelected={(delegateAddress) => {
                    formik.setFieldValue('delegateAddress', delegateAddress ?? '');
                }}
                delegates={delegates.slice(0, delegatesPerPage)}
                isLoading={isLoadingDelegates}
                votes={currentVotes}
                selectedDelegateAddress={formik.values.delegateAddress}
            />
        </SubPageLayout>
    );
};

export default Vote;
