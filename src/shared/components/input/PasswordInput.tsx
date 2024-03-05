import { useState } from 'react';
import styled from 'styled-components';
import { Container, FlexContainer, Icon, Input } from '@/shared/components';
import { isFirefox } from '@/lib/utils/isFirefox';

type Props = React.ComponentProps<typeof Input> & {
    labelText?: string;
};

const EyeButton = ({ showPassword, onClick }: { showPassword: boolean; onClick: () => void }) => {
    return (
        <StyledEyeWrapper
            as='button'
            onClick={onClick}
            color='base'
            width='28px'
            height='28px'
            borderRadius='50%'
            justifyContent='center'
            alignItems='center'
        >
            <Icon
                className='h-5 w-5 text-light-black dark:text-white'
                icon={showPassword ? 'eye-off' : 'eye'}
            />
        </StyledEyeWrapper>
    );
};

export const PasswordInput = ({ labelText, ...props }: Props) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container position='relative' color='base'>
            <Input
                type={showPassword ? 'text' : 'password'}
                labelText={labelText}
                {...props}
                className='pr-10'
                trailing={<EyeButton showPassword={showPassword} onClick={toggleShowPassword} />}
            />
        </Container>
    );
};

const StyledEyeWrapper = styled(FlexContainer)`
    cursor: pointer;
    ${({ theme }) => (isFirefox ? theme.browserCompatibility.firefox.focus : '')}
`;
