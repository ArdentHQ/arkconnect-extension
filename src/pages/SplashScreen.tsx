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
        <div className='flex flex-col justify-center items-center fixed top-0 left-0 h-[600px] w-full bg-theme-primary-700 animate-slideUp'>
          <div className='flex justify-center items-center flex-col gap-4 animate-fadeInTransformAndScale'>
            <Icon
                className='splash-screen-icon h-[38px] w-[38px] text-white'
                icon='logo-icon'
            />
            <Icon className='splash-screen-icon h-4 w-[170px]' icon='logo-text' />
          </div>
          <div className='absolute bottom-0 w-full flex flex-col translate-y-full animate-translateUp'>
            <div className='w-full h-[200px] bg-theme-primary-650 animate-decreaseHeight' />
            <div className='w-full h-[60px] bg-light-black dark:bg-white' />
          </div>
        </div>
    );
};

export default SplashScreen;
