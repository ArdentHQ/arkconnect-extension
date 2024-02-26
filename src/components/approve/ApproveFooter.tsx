import { Grid, Button } from '@/shared/components';

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
    <Grid gridGap='8px' gridTemplateColumns='repeat(2, 1fr)' px='16'>
      <Button variant='secondaryBlack' onClick={onCancel}>
        Refuse
      </Button>
      <Button variant='primary' disabled={disabled} onClick={onApprove}>
        Approve
      </Button>
    </Grid>
  );
};

export default ApproveFooter;
