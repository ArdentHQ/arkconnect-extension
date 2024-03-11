import { Button, Container, Grid } from '@/shared/components';

type ConnectFooterProps = {
    onSubmit: () => Promise<void>;
    onCancel: () => Promise<void>;
};
const ConnectFooter = ({ onSubmit, onCancel }: ConnectFooterProps) => {
    return (
        <Container px='16'>
            <p className='typeset-headline mb-8 text-theme-secondary-500 dark:text-theme-secondary-300'>
                It can see your address, balance, activity, and can send requests for transactions.
                It cannot access your funds without your approval.
            </p>
            <Grid gridGap='8px' gridTemplateColumns='repeat(2, 1fr)'>
                <Button variant='secondaryBlack' onClick={onCancel}>
                    Refuse
                </Button>
                <Button variant='primary' onClick={onSubmit}>
                    Connect
                </Button>
            </Grid>
        </Container>
    );
};

export default ConnectFooter;
