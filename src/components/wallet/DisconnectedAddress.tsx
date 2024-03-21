import { Heading } from '@/shared/components';

const DisconnectedAddress = () => {
    return (
        <div>
            <div className=' break-words'>
                <Heading level={4}>Disconnected Address</Heading>
            </div>

            <p className='typeset-headline mt-1.5 text-theme-secondary-500 dark:text-theme-secondary-300'>
                ARK Connect is currently not linked to this website. To establish a connection with
                a Web3 site, locate and click on the connect button.
            </p>
        </div>
    );
};

export default DisconnectedAddress;
