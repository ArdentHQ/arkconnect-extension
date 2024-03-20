import { Button, HeadingDescription } from '@/shared/components';

type ConnectFooterProps = {
    onSubmit: () => Promise<void>;
    onCancel: () => Promise<void>;
};
const ConnectFooter = ({ onSubmit, onCancel }: ConnectFooterProps) => {
    return (
        <div className='px-4'>
            <HeadingDescription className='mb-8'>
                It can see your address, balance, activity, and can send requests for transactions.
                It cannot access your funds without your approval.
            </HeadingDescription>
            <div className='grid grid-cols-2 gap-2'>
                <Button variant='secondaryBlack' onClick={onCancel}>
                    Refuse
                </Button>
                <Button variant='primary' onClick={onSubmit}>
                    Connect
                </Button>
            </div>
        </div>
    );
};

export default ConnectFooter;
