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
                    <div className='flex h-full items-center justify-center'>
                        <Loader variant='big' />
                    </div>
                )}
            </>
        );
    }

    return <>{children}</>;
};
