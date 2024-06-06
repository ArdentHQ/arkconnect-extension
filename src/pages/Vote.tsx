import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { runtime } from 'webextension-polyfill';
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
import { ScreenName } from '@/lib/background/contracts';

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

    const lastVisitedPage = profile.settings().get('LAST_VISITED_PAGE') as { data: VoteFormik };

    const formik = useFormik<VoteFormik>({
        initialValues: {
            fee: lastVisitedPage?.data?.fee || '',
            delegateAddress: lastVisitedPage?.data?.delegateAddress || '',
        },
        validationSchema: validationSchema,
        validateOnMount: true,
        onSubmit: () => {
            runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
            profile.settings().forget('LAST_VISITED_PAGE');
        },
    });

    useEffect(() => {
        runtime.sendMessage({
            type: 'SET_LAST_SCREEN',
            path: ScreenName.Vote,
            data: formik.values,
        });

        return () => {
            runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
            profile.settings().forget('LAST_VISITED_PAGE');
        };
    }, [formik.values]);

    return (
        <SubPageLayout
            title={t('PAGES.VOTE.VOTE')}
            className='flex flex-1 flex-col'
            bodyClassName='flex-1 flex flex-col'
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
                        fee={formik.values.fee}
                        delegateAddress={formik.values.delegateAddress}
                        votes={currentVotes}
                    />
                </Footer>
            }
        >
            <DelegatesSearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <DelegatesList
                onDelegateSelected={(delegateAddress) => {
                    formik.setFieldValue('delegateAddress', delegateAddress ?? '');
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
