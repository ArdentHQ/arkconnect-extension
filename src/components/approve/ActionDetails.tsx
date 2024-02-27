import { Container, FlexContainer, Paragraph } from '@/shared/components';
import styled from 'styled-components';

export const ActionDetailsRow = ({
  label,
  children,
}: {
  label: string | React.ReactNode;
  children: string | React.ReactNode;
}) => {
  return (
    <FlexContainer
      p='12'
      justifyContent='space-between'
      borderBottom='1px solid'
      borderColor='primaryDisabled'
    >
      <Paragraph $typeset='headline' fontWeight='regular' color='gray'>
        {label}
      </Paragraph>
      {children}
    </FlexContainer>
  );
};

const ActionDetails = ({
  children,
  maxHeight,
}: {
  children: React.ReactNode;
  maxHeight?: string;
}) => {
  return (
    <FlexContainer width='100%' height='100%' flexDirection='column' alignItems='center'>
      <Paragraph $typeset='body' fontWeight='medium' color='gray' mb='8' textAlign='center'>
        Details
      </Paragraph>

      <SyledContainer
        overflow='auto'
        className='custom-scroll'
        backgroundColor='secondaryBackground'
        borderRadius='8'
        width='100%'
        maxHeight={maxHeight}
      >
        {children}
      </SyledContainer>
    </FlexContainer>
  );
};

export default ActionDetails;

const SyledContainer = styled(Container)`
  ${({ theme }) => `
    box-shadow: inset 0 0 0 1px ${theme.colors.lightGrayBackground};
  `}
  & > div:last-child {
    border-bottom: none;
  }
`;
