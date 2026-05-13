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
        <div className='animate-slideUp bg-theme-primary-700 fixed top-0 left-0 flex h-[600px] w-full flex-col items-center justify-center'>
            <div className='animate-fadeInTransformAndScale flex flex-col items-center justify-center gap-4'>
                <Icon
                    className='splash-screen-icon h-[38px] w-[38px] text-white'
                    icon='logo-icon'
                />
                <Icon
                    className='splash-screen-icon text-theme-primary-200 green:text-theme-primary-300 h-4 w-[170px]'
                    icon='logo-text'
                />
            </div>
            <div className='animate-translateUp absolute bottom-0 flex w-full translate-y-full flex-col'>
                <div className='animate-decreaseHeight bg-theme-primary-650 h-[200px] w-full' />
                <div className='bg-light-black h-[60px] w-full dark:bg-white' />
            </div>
        </div>
    );
};

export default SplashScreen;
