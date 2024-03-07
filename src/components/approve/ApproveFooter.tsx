import { Button } from '@/shared/components';

type Props = {
    disabled?: boolean;
    onSubmit: () => Promise<void>;
    onCancel: () => Promise<void>;
};

const ApproveFooter = ({ disabled, onSubmit, onCancel }: Props) => {
    const onApprove = async () => {
        if (disabled) return;

        await onSubmit();
    };

    return (
        <div className=' grid grid-cols-2 gap-2 px-4'>
            <Button variant='secondaryBlack' onClick={onCancel}>
                Refuse
            </Button>
            <Button variant='primary' disabled={disabled} onClick={onApprove}>
                Approve
            </Button>
        </div>
    );
};

export default ApproveFooter;
