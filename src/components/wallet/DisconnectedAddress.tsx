import { HeadingTODO, Paragraph } from '@/shared/components';

const DisconnectedAddress = () => {
    return (
        <div>
            <div className=' break-words'>
                <HeadingTODO level={4}>Disconnected Address</HeadingTODO>
            </div>

            <Paragraph $typeset='headline' fontWeight='regular' color='gray' marginTop='6'>
                ARK Connect is currently not linked to this website. To establish a connection with
                a Web3 site, locate and click on the connect button.
            </Paragraph>
        </div>
    );
};

export default DisconnectedAddress;
