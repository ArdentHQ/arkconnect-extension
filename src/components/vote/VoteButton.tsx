import { useTranslation } from 'react-i18next';
import { Button, Tooltip } from '@/shared/components';

export const VoteButton = ({
    disabled,
    actionLabel,
    onClick,
    displayTooltip,
}: {
    disabled: boolean;
    actionLabel: string;
    onClick: () => void;
    displayTooltip: boolean;
}) => {
    const { t } = useTranslation();

    return (
        <Tooltip content={<span>{t('ERROR.BALANCE_TOO_LOW')}</span>} disabled={!displayTooltip}>
            <div>
                <Button variant='primary' onClick={onClick} disabled={disabled}>
                    {actionLabel}
                </Button>
            </div>
        </Tooltip>
    );
};
