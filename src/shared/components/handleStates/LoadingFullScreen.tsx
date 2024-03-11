import { Loader } from '../loader/Loader';

export const LoadingFullScreen = () => {
    return (
        <div className='flex h-screen w-screen items-center justify-center bg-subtle-white dark:bg-light-black'>
            <Loader variant='big' />
        </div>
    );
};
