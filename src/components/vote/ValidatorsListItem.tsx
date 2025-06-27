import { useTranslation } from 'react-i18next';

import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Contracts } from '@/lib/profiles';
import { ExternalLink, Icon, Tooltip } from '@/shared/components';

export const ValidatorsListItem = ({
    isSelected,
    isVoted,
    anyIsSelected,
    validator,
    onSelected,
}: {
    isSelected: boolean;
    isVoted: boolean;
    anyIsSelected: boolean;
    validator: Contracts.IReadOnlyWallet;
    onSelected: (delegate?: string) => void;
}) => {
    const { t } = useTranslation();
    const validatorAddress = validator.address();
    const addressRef = useRef<HTMLSpanElement>(null);
    const [disableTooltip, setDisableTooltip] = useState(false);

    const isUnselected = isVoted && (isSelected || (anyIsSelected && !isSelected));

    const isHighlighted = isVoted || isSelected;

    useEffect(() => {
        if (addressRef.current) {
            const { clientWidth, scrollWidth } = addressRef.current;
            setDisableTooltip(scrollWidth <= clientWidth);
        }
    }, [validatorAddress]);

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
                <span className='block max-w-36'>
                    <Tooltip content={validatorAddress} disabled={disableTooltip}>
                        <span
                            ref={addressRef}
                            className='block w-full overflow-hidden text-ellipsis whitespace-nowrap font-medium dark:text-white'
                        >
                            {validatorAddress}
                        </span>
                    </Tooltip>
                </span>
            </td>

            <td className='py-4'>
                <ExternalLink
                    href={validator.explorerLink()}
                    className='transition-smoothEase text-theme-primary-700 hover:text-theme-primary-600 dark:text-theme-primary-600 dark:hover:text-theme-primary-650'
                >
                    <Icon icon='link-external' className='h-4 w-4' />
                </ExternalLink>
            </td>

            <td className='p-4 text-right'>
                <button
                    type='button'
                    className={classNames('transition-smoothEase font-medium', {
                        'text-theme-primary-700 hover:text-theme-primary-600 dark:text-theme-primary-600 dark:hover:text-theme-primary-650':
                            !isUnselected,
                        'text-theme-error-600 hover:text-theme-error-500 dark:text-theme-error-500 dark:hover:text-theme-error-600':
                            isUnselected,
                    })}
                    onClick={() =>
                        isSelected ? onSelected(undefined) : onSelected(validator.address())
                    }
                >
                    {buttonLabel}
                </button>
            </td>
        </tr>
    );
};
