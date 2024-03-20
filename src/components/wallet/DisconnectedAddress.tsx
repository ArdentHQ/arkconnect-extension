import { Heading, HeadingDescription } from '@/shared/components';

const DisconnectedAddress = () => {
    return (
        <div>
            <div className=' break-words'>
                <Heading level={4}>Disconnected Address</Heading>
            </div>

            <HeadingDescription className='mt-1.5'>
                ARK Connect is currently not linked to this website. To establish a connection with
                a Web3 site, locate and click on the connect button.
            </HeadingDescription>
        </div>
    );
};

export default DisconnectedAddress;
