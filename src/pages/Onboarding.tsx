import { ReactNode, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    ControlConnectionsIcon,
    FingerPrintIcon,
    FlexContainer,
    Header,
    Heading,
    ProgressBar,
    TransactionsPassphraseIcon,
} from '@/shared/components';

type OnboardingScreen = {
    id: number;
    illustration: ReactNode;
    heading: ReactNode;
};

const Onboarding = () => {
    const navigate = useNavigate();

    const [activeOnboardingScreen, setActiveOnboardingScreen] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveOnboardingScreen((prevIndex) => (prevIndex + 1) % 3);
        }, 5000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <FadeInLayout paddingTop='58'>
            <Header />
            <ProgressBar />
            <Container position='relative' height='410px'>
                {onboardingScreens.map((screen, index) => (
                    <SlidingItem
                        key={screen.id}
                        className={`${
                            activeOnboardingScreen === index
                                ? 'isActive'
                                : activeOnboardingScreen > index
                                ? 'isPrev'
                                : 'isNext'
                        }`}
                        $flexVariant='columnCenter'
                        gridGap='24px'
                        paddingX='36'
                    >
                        <div className='flex flex-col items-center gap-6 text-center'>
                            {screen.illustration}
                            {screen.heading}
                        </div>
                    </SlidingItem>
                ))}
            </Container>
            <div className='flex flex-col gap-3 px-4'>
                <Button variant='primary' onClick={() => navigate('/wallet/create')}>
                    Create New Address
                </Button>
                <Button variant='secondary' onClick={() => navigate('/wallet')}>
                    Import an Address
                </Button>
            </div>
        </FadeInLayout>
    );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const FadeInLayout = styled(Container)`
    animation: ${fadeIn} 1s ease-in-out;
`;

const SlidingItem = styled(FlexContainer)`
    width: 100%;
    position: absolute;
    top: 70px;
    left: 0;
    opacity: 1;
    transition:
        transform 1s ease-in-out,
        opacity 1s ease-in-out;

    &.isActive {
        transform: translateX(0);
        opacity: 1;
    }

    &.isNext {
        transform: translateX(100%);
        opacity: 0;
    }

    &.isPrev {
        transform: translateX(-100%);
        opacity: 0;
    }
`;

const onboardingScreens: OnboardingScreen[] = [
    {
        id: 1,
        illustration: <FingerPrintIcon />,
        heading: (
            <Heading $typeset='h3' fontWeight='bold' textAlign='center' color='base' width='256px'>
                Easily & securely log in to <br /> your favorite web3 apps.
            </Heading>
        ),
    },
    {
        id: 2,
        illustration: <ControlConnectionsIcon />,
        heading: (
            <Heading $typeset='h3' fontWeight='bold' textAlign='center' color='base' width='297px'>
                Control your identity with our <br /> session management feature.
            </Heading>
        ),
    },
    {
        id: 3,
        illustration: <TransactionsPassphraseIcon />,
        heading: (
            <Heading $typeset='h3' fontWeight='bold' textAlign='center' color='base' width='257px'>
                Sign transactions and <br />
                perform on-chain actions.
            </Heading>
        ),
    },
];

export default Onboarding;
