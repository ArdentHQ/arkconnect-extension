import { Icon } from '@/shared/components';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

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
        <SplashScreenWrapper>
            <AnimatedContent>
                <Icon
                    className='splash-screen-icon'
                    icon='logo-icon'
                    color='white'
                    width='38px'
                    height='38px'
                />
                <Icon className='splash-screen-icon' icon='logo-text' width='170px' height='16px' />
            </AnimatedContent>
            <ContainersWrapper>
                <GreenContainer />
                <WhiteContainer />
            </ContainersWrapper>
        </SplashScreenWrapper>
    );
};

const fadeInAndTransform = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scale = keyframes`
  from {
    transform: scale(1);
  }

  to {
    transform: scale(0.9);
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
`;

const decreaseHeight = keyframes`
  0% {
    height: 200px;
  }
  50% {
    height: 100px;
  }
  75% {
    height: 80px;
  }
  100% {
    height: 60px;
  }
`;

const translateUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const SplashScreenWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    height: 600px;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.green700};
    animation: ${slideUp} 1.2s ease-in-out 1.8s forwards;
`;

const AnimatedContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    grid-gap: 16px;
    animation:
        ${fadeInAndTransform} 0.8s ease-in-out forwards,
        ${scale} 0.4s ease-in-out 1s forwards;
`;

const ContainersWrapper = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    transform: translateY(100%);
    animation: ${translateUp} 0.7s ease-in-out 1.8s forwards;
`;

const GreenContainer = styled.div`
    width: 100%;
    height: 200px;
    background-color: ${({ theme }) => theme.colors.green650};
    animation: ${decreaseHeight} 0.5s ease-in-out 2s forwards;
`;

const WhiteContainer = styled.div`
    width: 100%;
    height: 60px;
    background-color: ${({ theme }) => theme.colors.base};
`;

export default SplashScreen;
