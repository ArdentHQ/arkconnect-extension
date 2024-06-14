import assert from 'assert';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { BigNumber } from '@ardenthq/sdk-helpers';
import { object, string } from 'yup';
import { runtime } from 'webextension-polyfill';
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
import { ScreenName } from '@/lib/background/contracts';
import { useVote } from '@/lib/hooks/useVote';
import { useProfileContext } from '@/lib/context/Profile';

export type VoteFormik = {
    delegateAddress?: string;
    fee: string;
};

interface PageData extends VoteFormik {
    type?: string;
    session?: {
        walletId: string;
        logo: string;
        domain: string;
    };
}

const Vote = () => {
    const navigate = useNavigate();

    const { t } = useTranslation();
    const { profile } = useProfileContext();
    const { env } = useEnvironmentContext();
    const wallet = usePrimaryWallet();
    const [redirectToApprove, setRedirectToApprove] = useState(false);

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

    const lastVisitedPage = profile.settings().get('LAST_VISITED_PAGE') as { data: PageData };

    const approveVote = () => {
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
    };

    const formik = useFormik<VoteFormik>({
        initialValues: {
            fee: lastVisitedPage?.data?.fee || '',
            delegateAddress: lastVisitedPage?.data?.delegateAddress,
        },
        validationSchema: validationSchema,
        validateOnMount: true,
        onSubmit: () => {
            runtime.sendMessage({ type: 'CLEAR_LAST_SCREEN' });
            profile.settings().forget('LAST_VISITED_PAGE');
            formik.resetForm();

            approveVote();
        },
    });

    const hasValues = formik.values.delegateAddress && formik.values.fee;
    const hasSufficientFunds = BigNumber.make(wallet.balance() || 0).isGreaterThan(
        BigNumber.make(formik.values.fee || 0),
    );

    const { isVoting, isUnvoting, isSwapping, actionLabel, disabled, currentlyVotedAddress } =
        useVote({
            fee: formik.values.fee,
            delegateAddress: formik.values.delegateAddress,
            votes: currentVotes,
            isValid: !!(formik.isValid && hasValues && hasSufficientFunds),
        });

    useEffect(() => {
        // delegates.length === 0 means is the first time the page is loaded
        if (!redirectToApprove || isLoadingDelegates || delegates.length === 0) {
            return;
        }

        approveVote();
    }, [redirectToApprove, isLoadingDelegates, delegates]);

    useEffect(() => {
        if (['vote', 'unvote'].includes(lastVisitedPage?.data?.type ?? '')) {
            //  we need to wait for the vote/delegate to be loaded
            setRedirectToApprove(true);
        }
    }, [lastVisitedPage]);

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

    const handleFeeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.value = event.target.value.trim();
        formik.handleChange(event);
    };

    return (
        <SubPageLayout
            title={t('PAGES.VOTE.VOTE')}
            className='flex flex-1 flex-col'
            bodyClassName='flex-1 flex flex-col pb-4'
            footer={
                <Footer className='space-y-4'>
                    <VoteFee
                        delegateAddress={formik.values.delegateAddress}
                        fee={formik.values.fee}
                        onSelectedFee={(fee) => formik.setFieldValue('fee', fee)}
                        onBlur={formik.handleBlur}
                        feeError={formik.errors.fee}
                        handleFeeInputChange={handleFeeInputChange}
                    />

                    <VoteButton
                        onClick={formik.submitForm}
                        displayTooltip={!hasSufficientFunds}
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

            {!searchQuery && (
                <div className='mt-4'>
                    <p className='w-full text-center text-sm text-theme-secondary-500 dark:text-theme-secondary-300'>
                        {t('PAGES.VOTE.USE_SEARCH_TO_FIND_DELEGATES')}
                    </p>
                </div>
            )}
        </SubPageLayout>
    );
};

export default Vote;
