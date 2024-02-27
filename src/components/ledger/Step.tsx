import { FlexContainer, Paragraph } from '@/shared/components';

type Props = {
  step: number;
  disabled?: boolean;
};

const Step = ({ step, disabled = false }: Props) => {
  return (
    <FlexContainer
      minWidth='24px'
      minHeight='24px'
      justifyContent='center'
      alignItems='center'
      borderRadius='44'
      backgroundColor='ledgerStep'
    >
      <Paragraph $typeset='body' fontWeight='medium' color={disabled ? 'primary700' : 'primary'}>
        {step}
      </Paragraph>
    </FlexContainer>
  );
};

export default Step;
