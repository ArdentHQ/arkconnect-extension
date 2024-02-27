import styled, { keyframes } from 'styled-components';
import { variant as styledSystemVariant } from 'styled-system';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { ThemeMode } from '@/lib/store/ui';

type LoaderProps = React.ComponentPropsWithRef<typeof StyledLoader> & {
  variant: LoaderVariant;
};

type LoaderVariant = 'small' | 'big' | 'warning';

export const Loader = ({ variant, ...rest }: LoaderProps) => {
  return (
    <StyledLoader
      variant={variant}
      {...rest}
    />
  );
};

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const StyledLoader = styled.div<{ variant: LoaderVariant }>`
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;

  ${({ theme }) =>
    styledSystemVariant({
      variants: {
        small: {
          width: '24px',
          height: '24px',
          border: '2px solid transparent',
          borderTop: `2px solid ${theme.colors.white}`,
        },
        big: {
          width: '64px',
          height: '64px',
          border: `6px solid ${theme.colors.loaderBackground}`,
          borderTop: `6px solid ${theme.colors.primary}`,
        },
        warning: {
          width: '18px',
          height: '18px',
          border: `2px solid ${theme.colors.warning200}`,
          borderTop: `2px solid ${theme.colors.warning500}`,
        },
      },
    })};
`;
