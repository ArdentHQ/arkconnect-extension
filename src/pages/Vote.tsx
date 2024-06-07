import assert from 'assert';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { useNavigate } from 'react-router-dom';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { useDelegates } from '@/lib/hooks/useDelegates';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { assertWallet } from '@/lib/utils/assertions';
import { DelegatesList } from '@/components/vote/DelegatesList';
import { VoteButton } from '@/components/vote/VoteButton';
import { DelegatesSearchInput } from '@/components/vote/DelegatesSearchInput';
import constants from '@/constants';
import { Footer } from '@/shared/components/layout/Footer';
import { VoteFee } from '@/components/vote/VoteFee';
import { useVote } from '@/lib/hooks/useVote';
import { useProfileContext } from '@/lib/context/Profile';

export type VoteFormik = {
    delegateAddress?: string;
    fee: string;
};

const Vote = () => {
    const navigate = useNavigate();

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

        fetchVotes(wallet);
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
            delegateAddress: undefined,
        },
        validationSchema: validationSchema,
        validateOnMount: true,
        onSubmit: () => {
            const type = isVoting || isSwapping ? 'vote' : 'unvote';

            const data: {
                vote?: {
                    amount: number;
                    address: string;
                };
                unvote?: {
                    amount: number;
                    address: string;
                };
            } = {};

            if (isVoting || isSwapping) {
                assert(formik.values.delegateAddress);

                data.vote = {
                    amount: 0,
                    address: formik.values.delegateAddress,
                };
            }

            if (isUnvoting || isSwapping) {
                assert(currentlyVotedAddress);

                data.unvote = {
                    amount: 0,
                    address: currentlyVotedAddress,
                };
            }

            navigate('/approve', {
                state: {
                    type: type,
                    fee: Number(formik.values.fee),
                    ...data,
                    session: {
                        walletId: wallet?.id(),
                        logo: 'icon/128.png',
                        domain: 'ARK Connect',
                    },
                },
            });
        },
    });

    const { isVoting, isUnvoting, isSwapping, actionLabel, disabled, currentlyVotedAddress } =
        useVote({
            fee: formik.values.fee,
            delegateAddress: formik.values.delegateAddress,
            votes: currentVotes,
            isValid: formik.isValid,
        });

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
                        disabled={disabled}
                        actionLabel={actionLabel}
                    />
                </Footer>
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
