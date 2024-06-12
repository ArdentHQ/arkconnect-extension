import { Button } from '@/shared/components';

export const VoteButton = ({
    disabled,
    actionLabel,
    onClick,
}: {
    disabled: boolean;
    actionLabel: string;
    onClick: () => void;
}) => {
    return (
        <Button variant='primary' disabled={disabled} onClick={onClick}>
            {actionLabel}
        </Button>
    );
};
