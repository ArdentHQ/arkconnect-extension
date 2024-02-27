import { FlexContainer } from '../layout/FlexContainer';
import { Loader } from '../loader/Loader';

type Props = {
    children: React.ReactNode;
    loading?: boolean;
    loadingPlaceholder?: React.ReactNode;
};

export const HandleLoadingState = ({ loading, loadingPlaceholder, children }: Props) => {
    if (loading) {
        return (
            <>
                {loadingPlaceholder ? (
                    loadingPlaceholder
                ) : (
                    <FlexContainer justifyContent='center' height='100%' alignItems='center'>
                        <Loader variant='big' />
                    </FlexContainer>
                )}
            </>
        );
    }

    return <>{children}</>;
};
