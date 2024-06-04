import { useTranslation } from 'react-i18next';

import { Contracts } from '@ardenthq/sdk-profiles';
import classNames from 'classnames';
import { useMemo } from 'react';
import { ExternalLink, Icon } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';

export const DelegatesListItem = ({
    isSelected,
    delegate,
    onSelected,
}: {
    isSelected: boolean;
    delegate: Contracts.IReadOnlyWallet;
    onSelected: (delegate: Contracts.IReadOnlyWallet) => void;
}) => {
    const { t } = useTranslation();

    const buttonLabel = useMemo(() => {
        if (isSelected) {
            return t('PAGES.VOTE.ACTIONS.CURRENT');
        }

        return t('PAGES.VOTE.ACTIONS.SELECT');
    }, [isSelected]);

    return (
        <tr
            className={classNames({
                'bg-theme-primary-50': isSelected,
            })}
        >
            <td className='p-4'>
                <span className='font-medium dark:text-white'>
                    {trimAddress(delegate.username() || delegate.address(), 'long')}
                </span>
            </td>

            <td className='p-4'>
                <ExternalLink
                    href={delegate.explorerLink()}
                    className='transition-smoothEase text-theme-primary-700 hover:text-theme-primary-600 dark:text-theme-primary-600 dark:hover:text-theme-primary-650'
                >
                    <Icon icon='link-external' className='h-4 w-4' />
                </ExternalLink>
            </td>

            <td className='p-4'>
                <button
                    className='transition-smoothEase font-medium text-theme-primary-700 hover:text-theme-primary-600 dark:text-theme-primary-600 dark:hover:text-theme-primary-650'
                    type='button'
                    onClick={() => onSelected(delegate)}
                >
                    {buttonLabel}
                </button>
            </td>
        </tr>
    );
};
