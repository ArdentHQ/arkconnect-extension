import { FlexContainer } from '../layout/FlexContainer';
import { Loader } from '../loader/Loader';
import useThemeMode from '@/lib/hooks/useThemeMode';

export const LoadingFullScreen = () => {
    const { getThemeColor } = useThemeMode();

    return (
        <FlexContainer
            bg={getThemeColor('subtleWhite', 'lightBlack')}
            justifyContent='center'
            height='100vh'
            width='100vw'
            alignItems='center'
        >
            <Loader variant='big' />
        </FlexContainer>
    );
};
