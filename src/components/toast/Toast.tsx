import { FlexContainer, Icon, IconDefinition, Paragraph } from '@/shared/components';
import * as UIStore from '@/lib/store/ui';

const Toast = ({ type, message }: UIStore.Toast) => {
    return (
        <FlexContainer
            display='flex'
            alignItems='center'
            paddingX='10'
            paddingY='8'
            backgroundColor='base'
            borderRadius='8'
            marginTop='8'
        >
            <Icon icon={type as IconDefinition} className='h-5 w-5' />
            <Paragraph $typeset='body' fontWeight='regular' color='background' marginLeft='4'>
                {message}
            </Paragraph>
        </FlexContainer>
    );
};

export default Toast;
