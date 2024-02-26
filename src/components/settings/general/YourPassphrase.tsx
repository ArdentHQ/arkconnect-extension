import {
  FlexContainer,
  Paragraph,
  Container,
  Button,
  ToggleSwitch,
  PassphraseInput,
} from '@/shared/components';
import SubPageLayout from '../SubPageLayout';
import useClipboard from '@/lib/hooks/useClipboard';
import { useState } from 'react';
import { ToastPosition } from '@/components/toast/ToastContainer';

type Props = {
  passphrase: string;
};

const YourPassphrase = ({ passphrase }: Props) => {
  const { copy } = useClipboard();
  const [showPassphrase, setShowPassphrase] = useState<boolean>(false);

  const handleCopyToClipboard = () => {
    copy(passphrase, 'Passphrase', ToastPosition.HIGH);
  };

  return (
    <SubPageLayout title='Show Passphrase' hideCloseButton={false} paddingBottom='0'>
      <FlexContainer height='100%' flexDirection='column'>
        <Paragraph $typeset='headline' color='gray' mb='16'>
          Remember, anyone with your passphrase can steal your assets. Do not share this publicly.
        </Paragraph>
        <FlexContainer justifyContent='space-between' flex='1' flexDirection='column'>
          <Container>
            <Container mb='16' position='relative'>
              <PassphraseInput
                name='privateKey'
                className='read-only'
                rows={5}
                value={passphrase}
                hideValue={!showPassphrase}
                variant='primary'
                readOnly
                disabled
                maxHeight='145px'
              />
            </Container>
            <ToggleSwitch
              checked={showPassphrase}
              onChange={() => setShowPassphrase(!showPassphrase)}
              id='show-passphrase'
              title='Show Passphrase'
            />
          </Container>

          <Button variant='secondary' iconLeading='copy' onClick={handleCopyToClipboard}>
            Copy to Clipboard
          </Button>
        </FlexContainer>
      </FlexContainer>
    </SubPageLayout>
  );
};

export default YourPassphrase;
