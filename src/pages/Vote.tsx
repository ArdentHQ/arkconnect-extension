import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { object, string } from 'yup';
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

    return (
        <SubPageLayout
            title={t('PAGES.VOTE.VOTE')}
            footer={
                <VoteButton
                    onClick={formik.submitForm}
                    fee={formik.values.fee}
                    delegateAddress={formik.values.delegateAddress}
                    votes={currentVotes}
                />
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
