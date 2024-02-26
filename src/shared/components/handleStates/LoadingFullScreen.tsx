import useThemeMode from '@/lib/hooks/useThemeMode';
import { FlexContainer } from '../layout/FlexContainer';
import { Loader } from '../loader/Loader';
import { ThemeMode } from '@/lib/store/ui';

export const LoadingFullScreen = () => {
  const { currentThemeMode } = useThemeMode();

  return (
    <FlexContainer
      bg={currentThemeMode === ThemeMode.DARK ? 'lightBlack' : 'subtleWhite'}
      justifyContent='center'
      height='100vh'
      width='100vw'
      alignItems='center'
    >
      <Loader variant='big' />
    </FlexContainer>
  );
};
