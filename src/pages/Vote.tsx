import { object, string } from 'yup';
import { useEffect, useMemo, useState } from 'react';

import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { DelegatesList } from '@/components/vote/DelegatesList';
import { DelegatesSearchInput } from '@/components/vote/DelegatesSearchInput';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { VoteButton } from '@/components/vote/VoteButton';
import { assertWallet } from '@/lib/utils/assertions';
import constants from '@/constants';
import { useDelegates } from '@/lib/hooks/useDelegates';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { useProfileContext } from '@/lib/context/Profile';

export type VoteFormik = {
    delegateAddress?: string;
    fee: string;
};

const Vote = () => {
    const { t } = useTranslation();
    const { profile } = useProfileContext();
    const { env } = useEnvironmentContext();
    const wallet = usePrimaryWallet();

    assertWallet(wallet);

    const delegateCount = useMemo(() => wallet.network().delegateCount(), [wallet]);

    const [searchQuery, setSearchQuery] = useState<string>('');

    const { delegates, fetchDelegates, fetchVotes, currentVotes, isLoadingDelegates } =
        useDelegates({
            env,
            profile,
            searchQuery,
            limit: delegateCount,
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

    return (
        <SubPageLayout
            title={t('PAGES.VOTE.VOTE')}
            className='flex flex-1 flex-col'
            bodyClassName='flex-1 flex flex-col pb-4'
            footer={
                <VoteButton onClick={formik.submitForm} disabled={!(formik.isValid && hasValues)} />
            }
        >
            <DelegatesSearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <DelegatesList
                onDelegateSelected={(delegateAddress) => {
                    formik.setFieldValue('delegateAddress', delegateAddress);
                }}
                delegates={delegates.slice(0, delegateCount)}
                isLoading={isLoadingDelegates}
                votes={currentVotes}
                selectedDelegateAddress={formik.values.delegateAddress}
            />
        </SubPageLayout>
    );
};

export default Vote;
