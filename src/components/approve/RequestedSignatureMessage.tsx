import { FlexContainer, Paragraph } from '@/shared/components';

type Props = {
    data: { [key: string]: number | string };
};

const RequestedSignatureMessage = ({ data }: Props) => {
    return (
        <FlexContainer width='100%' flexDirection='column' alignItems='center' height='100%'>
            <Paragraph $typeset='body' fontWeight='medium' color='gray' mb='8'>
                Message
            </Paragraph>
            <FlexContainer
                backgroundColor='secondaryBackground'
                borderRadius='8'
                border='1px solid'
                borderColor='lightGrayBackground'
                padding='12'
                overflow='auto'
                width='100%'
                flex='1'
                className='custom-scroll'
            >
                <Paragraph $typeset='headline' fontWeight='regular' color='base'>
                    {data.message}
                </Paragraph>
            </FlexContainer>
        </FlexContainer>
    );
};

export default RequestedSignatureMessage;
