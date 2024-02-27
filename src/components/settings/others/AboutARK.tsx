import {
  Container,
  ExternalLink,
  FlexContainer,
  Icon,
  Paragraph,
  RowLayout,
} from '@/shared/components';
import SubPageLayout from '../SubPageLayout';
import styled from 'styled-components';
import useClipboard from '@/lib/hooks/useClipboard';
import constants from '@/constants';
import browser from 'webextension-polyfill';
import { isFirefox } from '@/lib/utils/isFirefox';

const AboutARK = () => {
  const { copy } = useClipboard();

  const copyEmailToClipboard = (evt: React.MouseEvent<HTMLDivElement>) => {
    evt.stopPropagation();
    evt.preventDefault();

    copy(constants.SUPPORT_EMAIL, 'Support email');
  };

  return (
    <SubPageLayout title='About ARK Connect'>
      <FlexContainer alignItems='center' flexDirection='column' gridGap='16px' mb='24' mt='8'>
        <StyledLogos alignItems='center' flexDirection='column' gridGap='16px'>
          <Icon icon='logo-inverted' width='52px' height='52px' color='primary' />
          <Icon icon='logo-text' width='228px' height='21px' color='primary' />
        </StyledLogos>
        <Paragraph $typeset='body' fontWeight='regular' color='gray'>
          Version {browser.runtime.getManifest().version}
        </Paragraph>
      </FlexContainer>
      <FlexContainer flexDirection='column' gridGap='8px' color='base'>
        <ExternalLink
          alignItems='center'
          display='flex'
          justifyContent='space-between'
          width='100%'
          href={`mailto:${constants.SUPPORT_EMAIL}?subject=ARK%20Connect`}
        >
          <RowLayout title='Support Email' iconTrailing='link-external' tabIndex={-1}>
            <CopyButton
              className='c-pointer'
              onClick={copyEmailToClipboard}
              as='button'
              border='none'
              backgroundColor='transparent'
            >
              <Icon icon='copy' width='20px' height='20px' color='base' />
            </CopyButton>
          </RowLayout>
        </ExternalLink>

        <ExternalLink
          alignItems='center'
          display='flex'
          justifyContent='space-between'
          width='100%'
          href={constants.ARK_CONNECT}
          target='_blank'
          rel='noopener noreferrer'
        >
          <RowLayout title='Official Website' iconTrailing='link-external' tabIndex={-1} />
        </ExternalLink>
        <ExternalLink
          alignItems='center'
          display='flex'
          justifyContent='space-between'
          width='100%'
          href={constants.TERMS_OF_SERVICE}
          target='_blank'
          rel='noopener noreferrer'
        >
          <RowLayout title='Terms of Service' iconTrailing='link-external' tabIndex={-1} />
        </ExternalLink>
        <ExternalLink
          alignItems='center'
          display='flex'
          justifyContent='space-between'
          width='100%'
          href={constants.PRIVACY_POLICY}
          target='_blank'
          rel='noopener noreferrer'
        >
          <RowLayout title='Privacy Policy' iconTrailing='link-external' tabIndex={-1} />
        </ExternalLink>
      </FlexContainer>
    </SubPageLayout>
  );
};

export const StyledLogos = styled(FlexContainer)`
  ${({ theme }) => `
    & path#ark {
      fill: ${theme.colors.logoText} !important;
    }

    & path#connect {
      fill: ${theme.colors.primary} !important;
    }

    & #ark-logo {
      fill: ${theme.colors.primary} !important;
    }
  `}
`;

export const CopyButton = styled(Container)`
  ${({ theme }) => `${isFirefox ? theme.browserCompatibility.firefox.focus : ''}`}
`;

export default AboutARK;
