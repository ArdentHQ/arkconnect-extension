import { useTranslation } from 'react-i18next';

import { Contracts } from '@ardenthq/sdk-profiles';
import classNames from 'classnames';
import { useMemo } from 'react';
import { ExternalLink, Icon } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';

export const DelegatesListItem = ({
    isSelected,
    isVoted,
    anyIsSelected,
    delegate,
    onSelected,
}: {
    isSelected: boolean;
    isVoted: boolean;
    anyIsSelected: boolean;
    delegate: Contracts.IReadOnlyWallet;
    onSelected: (delegate?: Contracts.IReadOnlyWallet) => void;
}) => {
    const { t } = useTranslation();

    const isUnselected = isVoted && (isSelected || (anyIsSelected && !isSelected));

    const isHighlighted = isVoted || isSelected;

    const buttonLabel = useMemo(() => {
        if (isUnselected) {
            return t('PAGES.VOTE.ACTIONS.UNSELECTED');
        }

        if (isSelected) {
            return t('PAGES.VOTE.ACTIONS.SELECTED');
        }

        if (isVoted) {
            return t('PAGES.VOTE.ACTIONS.CURRENT');
        }

        return t('PAGES.VOTE.ACTIONS.SELECT');
    }, [isSelected, isVoted, isUnselected]);

    return (
        <tr
            className={classNames({
                'hover:bg-theme-secondary-50 dark:hover:bg-theme-secondary-700': !isHighlighted,
                'bg-theme-primary-50 dark:bg-theme-primary-800/25': isHighlighted && !isUnselected,
                'bg-theme-error-50 dark:bg-theme-error-800/25': isUnselected,
            })}
        >
            <td className='p-4'>
                <span className='font-medium dark:text-white'>
                    {trimAddress(delegate.username() || delegate.address(), 'long')}
                </span>
            </td>

            <td className='py-4'>
                <ExternalLink
                    href={delegate.explorerLink()}
                    className='transition-smoothEase text-theme-primary-700 hover:text-theme-primary-600 dark:text-theme-primary-600 dark:hover:text-theme-primary-650'
                >
                    <Icon icon='link-external' className='h-4 w-4' />
                </ExternalLink>
            </td>

            <td className='p-4 text-right '>
                <button
                    type='button'
                    className={classNames('transition-smoothEase font-medium', {
                        'text-theme-primary-700 hover:text-theme-primary-600 dark:text-theme-primary-600 dark:hover:text-theme-primary-650':
                            !isUnselected,
                        'text-theme-error-600 hover:text-theme-error-500 dark:text-theme-error-500 dark:hover:text-theme-error-600':
                            isUnselected,
                    })}
                    onClick={() => (isSelected ? onSelected(undefined) : onSelected(delegate))}
                >
                    {buttonLabel}
                </button>
            </td>
        </tr>
    );
};