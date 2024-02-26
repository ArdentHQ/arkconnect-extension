import { Input, Container } from '@/shared/components';
import { useState } from 'react';
import styled from 'styled-components';
import { isFirefox } from '@/lib/utils/isFirefox';

type Props = React.ComponentProps<typeof Input> & {
  labelText?: string;
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
        iconTrailing={showPassword ? 'eye-off' : 'eye'}
      />
      <StyledEyeWrapper position='relative' onClick={toggleShowPassword} as='button' color='base' border='none' backgroundColor='transparent' top={labelText ? '36px' : '12px'} />
    </Container>
  );
};

const StyledEyeWrapper = styled(Container)`
  width: 28px;
  height: 28px;
  position: absolute;
  right: 8px;
  cursor: pointer;
  border-radius: 50%;

  ${({ theme }) => isFirefox ? theme.browserCompatibility.firefox.focus : ''}
`;
