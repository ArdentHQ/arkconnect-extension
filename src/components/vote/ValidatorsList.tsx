import { useTranslation } from 'react-i18next';
import { ValidatorsListItem } from './ValidatorsListItem';
import { ValidatorsListItemSkeleton } from './ValidatorsListItemSkeleton';
import { Contracts } from '@/lib/profiles';
import { WarningIcon } from '@/shared/components';

export const ValidatorsList = ({
    validators,
    isLoading,
    onValidatorSelected,
    votes,
    selectedValidatorAddress,
}: {
    validators: Contracts.IReadOnlyWallet[];
    isLoading: boolean;
    onValidatorSelected: (validatorAddress?: string) => void;
    votes: Contracts.VoteRegistryItem[];
    selectedValidatorAddress?: string;
}) => {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className='dark:bg-subtle-black w-full overflow-hidden rounded-xl bg-white py-2'>
                <table className='w-full table-fixed'>
                    <tbody>
                        {Array.from({ length: 10 }).map((_, index) => {
                            return <ValidatorsListItemSkeleton key={index} />;
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    if (validators.length === 0) {
        return (
            <div className='flex flex-1 items-center'>
                <div className='mx-auto flex max-w-64 flex-col items-center space-y-4 text-center'>
                    <span>
                        <WarningIcon iconClassName='w-[130px] h-auto' />
                    </span>
                    <span className='dark:text-white'>{t('PAGES.VOTE.NO_RESULTS')}</span>
                </div>
            </div>
        );
    }

    return (
        <div className='dark:bg-subtle-black w-full overflow-hidden rounded-xl bg-white py-2'>
            <table className='w-full table-fixed'>
                <tbody>
                    {validators.map((validator) => {
                        return (
                            <ValidatorsListItem
                                onSelected={onValidatorSelected}
                                key={validator.address()}
                                validator={validator}
                                isSelected={selectedValidatorAddress === validator.address()}
                                isVoted={votes.some(
                                    (vote) => vote.wallet?.address() === validator.address(),
                                )}
                                anyIsSelected={selectedValidatorAddress !== undefined}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
