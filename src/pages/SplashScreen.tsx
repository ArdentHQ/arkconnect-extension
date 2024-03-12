import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Icon } from '@/shared/components';

const SplashScreen = () => {
    const [animationFinished, setAnimationFinished] = useState<boolean>(false);

    useEffect(() => {
        const animationTimeout = setTimeout(() => {
            setAnimationFinished(true);
        }, 3000);

        return () => {
            clearTimeout(animationTimeout);
        };
    }, []);

    if (animationFinished) return <Navigate to={'/onboarding'} />;

    return (
        <div className='fixed left-0 top-0 flex h-[600px] w-full animate-slideUp flex-col items-center justify-center bg-theme-primary-700'>
            <div className='flex animate-fadeInTransformAndScale flex-col items-center justify-center gap-4'>
                <Icon
                    className='splash-screen-icon h-[38px] w-[38px] text-white'
                    icon='logo-icon'
                />
                <Icon className='splash-screen-icon h-4 w-[170px]' icon='logo-text' />
            </div>
            <div className='absolute bottom-0 flex w-full translate-y-full animate-translateUp flex-col'>
                <div className='h-[200px] w-full animate-decreaseHeight bg-theme-primary-650' />
                <div className='h-[60px] w-full bg-light-black dark:bg-white' />
            </div>
        </div>
    );
};

export default SplashScreen;
