import { useTranslation } from 'react-i18next';

import { Contracts } from '@ardenthq/sdk-profiles';
import { ExternalLink, Icon } from '@/shared/components';
import trimAddress from '@/lib/utils/trimAddress';

export const DelegatesListItem = ({ delegate }: { delegate: Contracts.IReadOnlyWallet }) => {
    const { t } = useTranslation();

    return (
        <tr>
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
                <button className='transition-smoothEase font-medium text-theme-primary-700 hover:text-theme-primary-600 dark:text-theme-primary-600 dark:hover:text-theme-primary-650'>
                    {t('PAGES.VOTE.ACTIONS.SELECT')}
                </button>
            </td>
        </tr>
    );
};
