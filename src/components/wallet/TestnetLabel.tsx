import styled from 'styled-components';
import { Container, Paragraph } from '@/shared/components';

const TestnetLabel = () => {
    return (
        <StyledLabel paddingX='8' paddingY='6' backgroundColor='testNetLabel'>
            <Paragraph $typeset='body' fontWeight='medium'>
                Testnet
            </Paragraph>
        </StyledLabel>
    );
};

const StyledLabel = styled(Container)`
    transition: all 0.3s ease-in-out;
    ${({ theme }) => `
    color: ${theme.colors.warning};
    border: 1px solid ${theme.colors.warning};
  `}

    border-radius: 8px;
    text-decoration: none;
    transition: all 0.3s ease-in-out;
`;

export default TestnetLabel;
