import { useEffect, useState } from 'react';
import { FormikProps } from 'formik';
import { WalletFormScreen } from '../form-persist';
import { persistScreenChanged } from '../form-persist/helpers';
import { CreateWalletFormik } from '.';
import {
  Button,
  Container,
  FlexContainer,
  Grid,
  Heading,
  Icon,
  Paragraph,
  ToggleSwitch,
} from '@/shared/components';
import useToast from '@/lib/hooks/useToast';
import { ToastPosition } from '@/components/toast/ToastContainer';
import randomWordPositions from '@/lib/utils/randomWordPositions';
import { TestnetIcon } from '@/components/wallet/address/Address.blocks';
import { useAppSelector } from '@/lib/store';
import { selectTestnetEnabled } from '@/lib/store/ui';
import { getLocalValues } from '@/lib/utils/localStorage';

type Props = {
  goToNextStep: () => void;
  formik: FormikProps<CreateWalletFormik>;
};

const GeneratePassphrase = ({ goToNextStep, formik }: Props) => {
  const [showPassphrase, setShowPassphrase] = useState<boolean>(false);

  const toast = useToast();

  const isTestnet = useAppSelector(selectTestnetEnabled);

  useEffect(() => {
    (async () => {
      const { hasOnboarded } = await getLocalValues();

      if (hasOnboarded) {
        persistScreenChanged({
          screen: WalletFormScreen.OVERVIEW,
          step: 0,
        });
      }
    })();
  }, []);

  const copyPassphraseToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formik.values.passphrase.join(' '));
      toast('success', 'Passphrase Copied to Clipboard', ToastPosition.HIGH);
    } catch {
      toast('danger', 'Failed to Copy to Clipboard', ToastPosition.HIGH);
    }
  };

  const handleNextStep = () => {
    const confirmationNumbers = randomWordPositions(24);

    formik.setFieldValue('confirmationNumbers', confirmationNumbers);

    goToNextStep();
  };

  const generatePassphraseUI = (word: string, index: number, sliceIndex: number) => {
    const isHidden = !showPassphrase;
    const wordLength = word.length;

    return (
      <FlexContainer
        key={index}
        gridGap='6px'
        alignItems='center'
        paddingBottom={index + 1 < sliceIndex ? '6' : '0'}
      >
        <Paragraph $typeset='body' color='gray' width='auto'>
          {index + 1}
        </Paragraph>
        <Paragraph $typeset='headline' fontWeight='medium' color='base'>
          {isHidden ? '•'.repeat(wordLength) : word}
        </Paragraph>
      </FlexContainer>
    );
  };

  return (
    <FlexContainer flex='1' flexDirection='column'>
      <FlexContainer mb='8' alignItems='center' gridGap='8'>
        <Heading $typeset='h3' fontWeight='bold' color='base'>
          Save Your Secret Passphrase
        </Heading>
        {isTestnet && <TestnetIcon />}
      </FlexContainer>
      <Paragraph $typeset='headline' color='gray' mb='16'>
        Write down or copy your passphrase. Make sure to store it safely.
      </Paragraph>
      {formik.values.passphrase && (
        <Container
          borderRadius='8'
          bg='secondaryBackground'
          border='1px solid'
          borderColor='lightGray'
          padding='12'
          mb='16'
          maxHeight='226px'
        >
          <Grid gridGap='10px' gridTemplateColumns='repeat(3, 1fr)'>
            <FlexContainer
              flex='1'
              flexDirection='column'
              borderRight='1px solid'
              borderColor='toggleInactive'
              pr='10'
            >
              {formik.values.passphrase
                .slice(0, 8)
                .map((word: string, index: number) => generatePassphraseUI(word, index, 8))}
            </FlexContainer>
            <FlexContainer
              flex='1'
              flexDirection='column'
              borderRight='1px solid'
              borderColor='toggleInactive'
              pr='10'
            >
              {formik.values.passphrase
                .slice(8, 16)
                .map((word: string, index: number) => generatePassphraseUI(word, index + 8, 16))}
            </FlexContainer>
            <FlexContainer flex='1' flexDirection='column'>
              {formik.values.passphrase
                .slice(16, 24)
                .map((word: string, index: number) => generatePassphraseUI(word, index + 16, 24))}
            </FlexContainer>
          </Grid>
        </Container>
      )}
      <FlexContainer justifyContent='space-between' alignItems='center'>
        <ToggleSwitch
          checked={showPassphrase}
          onChange={() => setShowPassphrase(!showPassphrase)}
          id='show-password'
          title='Show Passphrase'
        />

        <FlexContainer
          gridGap='8px'
          color='primary'
          className='c-pointer'
          onClick={copyPassphraseToClipboard}
          as='button'
          border='none'
          backgroundColor='transparent'
          alignItems='center'
          height='20px'
          overflow='hidden'
        >
          <Container as='span' display='inline-block'>
            <Icon icon='copy' width='18px' height='18px' />
          </Container>

          <Paragraph
            $typeset='headline'
            fontWeight='medium'
            as='span'
            style={{ lineHeight: '18px' }}
            display='inline-block'
          >
            Copy
          </Paragraph>
        </FlexContainer>
      </FlexContainer>

      <Button variant='primary' onClick={handleNextStep} mt='auto'>
        Continue
      </Button>
    </FlexContainer>
  );
};

export default GeneratePassphrase;
