import assert from 'assert';
import { object, string } from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { runtime } from 'webextension-polyfill';
import { useFormik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BigNumber } from '@/lib/helpers';
import { ValidatorsList } from '@/components/vote/ValidatorsList';
import { ValidatorsSearchInput } from '@/components/vote/ValidatorsSearchInput';
import { Footer } from '@/shared/components/layout/Footer';
import { ScreenName } from '@/lib/background/contracts';
import SubPageLayout from '@/components/settings/SubPageLayout';
import { VoteButton } from '@/components/vote/VoteButton';
import { VoteFee } from '@/components/vote/VoteFee';
import { assertWallet } from '@/lib/utils/assertions';
import constants from '@/constants';
import { useValidators } from '@/lib/hooks/useValidators';
import { useEnvironmentContext } from '@/lib/context/Environment';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import { useProfileContext } from '@/lib/context/Profile';
import { useVote } from '@/lib/hooks/useVote';
import { calculateGasFee } from '@/lib/hooks/useNetworkFees';
import { FeeLimits } from '@/components/fees';

export type VoteFormik = {
    validatorAddress?: string;
    gasPrice: string;
    gasLimit: string;
    feeClass?: string;
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
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();
    const { profile } = useProfileContext();
    const { env } = useEnvironmentContext();
    const wallet = usePrimaryWallet();
    const [redirectToApprove, setRedirectToApprove] = useState(false);

    assertWallet(wallet);

    const validatorCount = useMemo(() => wallet.network().validatorCount(), [wallet]);

    const [searchQuery, setSearchQuery] = useState<string>('');

    const { validators, fetchValidators, fetchVotes, currentVotes, isLoadingValidators } =
        useValidators({
            env,
            profile,
            searchQuery,
            limit: validatorCount,
        });

    useEffect(() => {
        void fetchValidators(wallet);

        void fetchVotes(wallet);
    }, [wallet]);

    const validationSchema = object().shape({
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
        validatorAddress: string().required(t('ERROR.IS_REQUIRED', { name: 'Validator' })),
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
            assert(formik.values.validatorAddress);

            data.vote = {
                amount: 0,
                address: formik.values.validatorAddress,
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
                gasPrice: formik.values.gasPrice,
                gasLimit: formik.values.gasLimit,
                ...data,
                session: {
                    walletId: wallet?.id(),
                    logo: 'icon/128.png',
                    domain: constants.APP_NAME,
                },
                feeClass: formik.values.feeClass,
            },
        });
    };

    const formik = useFormik<VoteFormik>({
        initialValues: {
            gasPrice: searchParams.get('gasPrice') || lastVisitedPage?.data?.gasPrice || '',
            gasLimit: searchParams.get('gasLimit') || lastVisitedPage?.data?.gasLimit || '',
            feeClass:
                searchParams.get('feeClass') ||
                lastVisitedPage?.data?.feeClass ||
                constants.FEE_AVERAGE,
            validatorAddress:
                searchParams.get('vote') ||
                searchParams.get('unvote') ||
                lastVisitedPage?.data?.validatorAddress,
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

    const isFeeValid = formik.values.gasPrice && formik.values.gasLimit;
    const fee = calculateGasFee(formik.values.gasPrice, formik.values.gasLimit);
    const hasValues = formik.values.validatorAddress && isFeeValid;
    const hasSufficientFunds = BigNumber.make(wallet.balance() || 0).isGreaterThan(fee);

    const { isVoting, isUnvoting, isSwapping, actionLabel, disabled, currentlyVotedAddress } =
        useVote({
            fee: isFeeValid ? fee : BigNumber.ZERO,
            validatorAddress: formik.values.validatorAddress,
            votes: currentVotes,
            isValid: !!(hasValues && hasSufficientFunds),
        });

    useEffect(() => {
        // validators.length === 0 means is the first time the page is loaded
        if (!redirectToApprove || isLoadingValidators || validators.length === 0) {
            return;
        }

        approveVote();
    }, [redirectToApprove, isLoadingValidators, validators]);

    useEffect(() => {
        if (['vote', 'unvote'].includes(lastVisitedPage?.data?.type ?? '')) {
            //  we need to wait for the vote/validators to be loaded
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

    return (
        <SubPageLayout
            title={t('PAGES.VOTE.VOTE')}
            className='flex flex-1 flex-col'
            bodyClassName='flex-1 flex flex-col pb-4'
            footer={
                <Footer className='space-y-4'>
                    <VoteFee formik={formik} />

                    <VoteButton
                        onClick={formik.submitForm}
                        displayTooltip={!hasSufficientFunds}
                        disabled={disabled}
                        actionLabel={actionLabel}
                    />
                </Footer>
            }
        >
            <ValidatorsSearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <ValidatorsList
                onValidatorSelected={(validatorAddress) => {
                    formik.setFieldValue('validatorAddress', validatorAddress);
                }}
                validators={validators.slice(0, validatorCount)}
                isLoading={isLoadingValidators}
                votes={currentVotes}
                selectedValidatorAddress={formik.values.validatorAddress}
            />

            {!searchQuery && (
                <div className='mt-4'>
                    <p className='text-theme-secondary-500 dark:text-theme-secondary-300 w-full text-center text-sm'>
                        {t('PAGES.VOTE.USE_SEARCH_TO_FIND_VALIDATORS')}
                    </p>
                </div>
            )}
        </SubPageLayout>
    );
};

export default Vote;
