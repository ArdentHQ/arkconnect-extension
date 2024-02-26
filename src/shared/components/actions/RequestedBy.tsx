import { FlexContainer, Paragraph } from '@/shared/components';
import styled from 'styled-components';
import formatDomain from '@/lib/utils/formatDomain';
import ConnectionLogoImage from '../../../components/connections/ConnectionLogoImage';
import useThemeMode from '@/lib/hooks/useThemeMode';

type Props = {
  appName?: string;
  appLogo?: string;
  appDomain: string;
};

const DomainName = styled(Paragraph)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
`;

const StyledParagraph = styled(Paragraph)`
  white-space: nowrap;
`;

const RequestedBy = ({ appDomain, appLogo }: Props) => {
  const { getThemeColor } = useThemeMode();

  return (
    <FlexContainer
      backgroundColor={getThemeColor('white', 'subtleBlack')}
      flexDirection='row'
      alignItems='center'
      width='100%'
      justifyContent='center'
      p='16'
    >
      <ConnectionLogoImage appLogo={appLogo} appName={appDomain} roundCorners />

      <StyledParagraph $typeset='body' fontWeight='regular' color='gray' ml='8'>
        Requested by
      </StyledParagraph>

      <DomainName color='base' display='inline'>
        &nbsp;
        {formatDomain(appDomain, false)}
      </DomainName>
    </FlexContainer>
  );
};

export default RequestedBy;
