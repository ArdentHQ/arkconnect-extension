import { EmptyConnectionsIcon } from '@/shared/components';

const EmptyConnections = () => {
    return (
        <div className=' mx-4 mb-4 mt-24 flex flex-1 flex-col items-center justify-center'>
            <div className='flex max-w-[210px] flex-col items-center justify-center'>
                <EmptyConnectionsIcon />

                <p className=' mt-6 text-center text-light-black dark:text-white '>
                    You are currently not connected to any applications.
                </p>
            </div>
        </div>
    );
};

export default EmptyConnections;
