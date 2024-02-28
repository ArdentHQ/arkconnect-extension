import { useState } from 'react';
import styled from 'styled-components';
import { Input, Container, Icon, FlexContainer } from '@/shared/components';
import { isFirefox } from '@/lib/utils/isFirefox';

type Props = React.ComponentProps<typeof Input> & {
    labelText?: string;
};

const EyeButton = ({
    showPassword,
    onClick,
    labelText,
}: {
    showPassword: boolean;
    onClick: () => void;
    labelText?: string;
}) => {
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
            top={labelText ? '36px' : '12px'}
        >
            <Icon width='20px' height='20px' icon={showPassword ? 'eye-off' : 'eye'} color='base' />
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
                paddingRight='40'
                trailing={
                    <EyeButton
                        showPassword={showPassword}
                        onClick={toggleShowPassword}
                        labelText={labelText}
                    />
                }
            />
        </Container>
    );
};

const StyledEyeWrapper = styled(FlexContainer)`
    cursor: pointer;
    ${({ theme }) => (isFirefox ? theme.browserCompatibility.firefox.focus : '')}
`;
