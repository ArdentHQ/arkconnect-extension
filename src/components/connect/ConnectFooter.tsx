import { Button, Grid, Paragraph } from '@/shared/components';

type ConnectFooterProps = {
    onSubmit: () => Promise<void>;
    onCancel: () => Promise<void>;
};
const ConnectFooter = ({ onSubmit, onCancel }: ConnectFooterProps) => {
    return (
        <div className='px-4'>
            <Paragraph $typeset='headline' fontWeight='regular' color='gray' mb='32'>
                It can see your address, balance, activity, and can send requests for transactions.
                It cannot access your funds without your approval.
            </Paragraph>
            <Grid gridGap='8px' gridTemplateColumns='repeat(2, 1fr)'>
                <Button variant='secondaryBlack' onClick={onCancel}>
                    Refuse
                </Button>
                <Button variant='primary' onClick={onSubmit}>
                    Connect
                </Button>
            </Grid>
        </div>
    );
};

export default ConnectFooter;
