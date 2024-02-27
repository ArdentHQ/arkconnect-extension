import styled from 'styled-components';
import { Container, Icon } from '@/shared/components';

import { ThemeMode } from '@/lib/store/ui';
import useThemeMode, { Color } from '@/lib/hooks/useThemeMode';

type Props = {
  alt?: string;
  appLogo?: string;
  appName?: string;
  withBorder?: boolean;
  borderColor?: Color;
  width?: string;
  height?: string;
  roundCorners?: boolean;
};

const StyledConnectionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
const StyledContainer = styled(Container)`
  flex-shrink: 0;
`;

const ConnectionLogoImage = ({
  appName,
  appLogo,
  alt,
  withBorder = false,
  borderColor = 'background',
  width = '20px',
  height = '20px',
  roundCorners = false,
}: Props) => {
  if (appLogo) {
    return (
      <StyledContainer
        width={width}
        height={height}
        border={withBorder ? '10px solid' : undefined}
        borderColor={withBorder ? borderColor : undefined}
        borderRadius={roundCorners ? '100%' : undefined}
        overflow='hidden'
        backgroundColor='background'
      >
        <StyledConnectionImage src={appLogo} alt={alt || appName} />
      </StyledContainer>
    );
  }

  const { currentThemeMode } = useThemeMode();
  const defaultFavicon =
    currentThemeMode === ThemeMode.LIGHT ? 'default-favicon-light' : 'default-favicon-dark';

  return <Icon icon={defaultFavicon} width={'15px'} height={'15px'} color='primary' />;
};

export default ConnectionLogoImage;
