import Balance from '@/components/wallet/Balance';
import {
  Container,
  FlexContainer,
  Paragraph,
  Icon,
  Layout,
  ExternalLink,
} from '@/shared/components';
import constants from '@/constants';
import { useEffect } from 'react';
import { clearPersistScreenData } from '@/components/wallet/form-persist/helpers';
import { useProfileContext } from '@/lib/context/Profile';
import { usePrimaryWallet } from '@/lib/hooks/usePrimaryWallet';
import useThemeMode from '@/lib/hooks/useThemeMode';

const Home = () => {
  const { convertedBalance } = useProfileContext();

  const primaryWallet = usePrimaryWallet();

  const { getThemeColor } = useThemeMode();

  useEffect(() => {
    clearPersistScreenData();
  }, []);

  return (
    <Layout data-testid='Home'>
      <Container margin='16'>
        <Container
          bg='secondaryBackground'
          boxShadow='light'
          borderTopLeftRadius='20'
          borderTopRightRadius='20'
          borderBottomLeftRadius='16'
          borderBottomRightRadius='16'
        >
          <Container borderRadius='20' bg='primary' color='white'>
            <Container padding='16'>
              <Balance
                balance={primaryWallet?.balance() ?? 0}
                currency={primaryWallet?.currency() ?? 'ARK'}
                exchangeCurrency={primaryWallet?.exchangeCurrency() ?? 'USD'}
                convertedBalance={convertedBalance}
              />
            </Container>
            <FlexContainer
              padding='16'
              borderTop='1px solid'
              borderColor='dividerGreen'
              justifyContent='space-between'
            >
              <ExternalLink
                gridGap='8px'
                alignItems='center'
                display='flex'
                href={
                  primaryWallet?.network().isLive()
                    ? `${constants.ARKSCAN_ADDRESSES}/${primaryWallet?.address()}`
                    : `${constants.ARKSCAN_TEST_ADDRESSES}/${primaryWallet?.address()}`
                }
              >
                <Paragraph $typeset='body' fontWeight='medium'>
                  Explorer
                </Paragraph>
                <Icon icon='link-external' width='16px' height='16px' />
              </ExternalLink>
              <Icon icon='divider' width='2px' height='18px' color='dividerGreen' />

              <ExternalLink
                gridGap='8px'
                alignItems='center'
                display='flex'
                href={
                  primaryWallet?.network().isTest()
                    ? constants.ARKSCAN_FAUCET
                    : constants.ARKSCAN_EXCHANGES
                }
              >
                <Paragraph $typeset='body' fontWeight='medium'>
                  {primaryWallet?.network().isTest() ? 'Faucet' : 'Exchanges'}
                </Paragraph>
                <Icon icon='link-external' width='16px' height='16px' />
              </ExternalLink>
            </FlexContainer>
          </Container>
          <ExternalLink
            href={constants.ARK_CONNECT_DEMO}
            color={getThemeColor('primary', 'green600')}
          >
            <FlexContainer
              padding='16'
              flexDirection='row'
              justifyContent='space-between'
              alignItems='center'
            >
              <Icon icon='speakerphone' width='18px' height='18px' />
              <Paragraph $typeset='body' fontWeight='medium'>
                Try Our Demo App Now!
              </Paragraph>
              <Icon icon='link-external' width='16px' height='16px' />
            </FlexContainer>
          </ExternalLink>
        </Container>
      </Container>
    </Layout>
  );
};

export default Home;
