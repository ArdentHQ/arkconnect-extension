import { Heading, Paragraph } from '@/shared/components';

const DisconnectedAddress = () => {
    return (
        <div>
            <div className=' break-words'>
                <Heading $typeset='h4' fontWeight='medium' color='base'>
                    Disconnected Address
                </Heading>
            </div>

            <Paragraph
                $typeset='headline'
                fontWeight='regular'
                className='text-theme-secondary-500 dark:text-theme-secondary-300'
                marginTop='6'
            >
                ARK Connect is currently not linked to this website. To establish a connection with
                a Web3 site, locate and click on the connect button.
            </Paragraph>
        </div>
    );
};

export default DisconnectedAddress;
