import { ReactNode, useEffect, useState } from 'react';

import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import {
    Button,
    ControlConnectionsIcon,
    FingerPrintIcon,
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
        <div className='fade pt-[58px] duration-1000 ease-in-out'>
            <Header />
            <ProgressBar />
            <div className='relative h-[410px]'>
                {onboardingScreens.map((screen, index) => (
                    <div
                        className={cn(
                            'absolute left-0 top-[70px] flex w-full items-center justify-center gap-6 px-9 transition-all duration-1000 ease-in-out',
                            {
                                'translate-x-0 opacity-100': activeOnboardingScreen === index,
                                '-translate-x-full opacity-0': activeOnboardingScreen > index,
                                'translate-x-full opacity-0': activeOnboardingScreen < index,
                            },
                        )}
                        key={screen.id}
                    >
                        <div className='flex flex-col items-center gap-6 text-center'>
                            {screen.illustration}
                            {screen.heading}
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex flex-col gap-3 px-4'>
                <Button variant='primary' onClick={() => navigate('/wallet/create')}>
                    Create New Address
                </Button>
                <Button variant='secondary' onClick={() => navigate('/wallet')}>
                    Import an Address
                </Button>
            </div>
        </div>
    );
};

const onboardingScreens: OnboardingScreen[] = [
    {
        id: 1,
        illustration: <FingerPrintIcon />,
        heading: (
            <Heading level={3} className='w-[256px] text-center'>
                Easily & securely log in to <br /> your favorite web3 apps.
            </Heading>
        ),
    },
    {
        id: 2,
        illustration: <ControlConnectionsIcon />,
        heading: (
            <Heading level={3} className='w-[297px] text-center'>
                Control your identity with our <br /> session management feature.
            </Heading>
        ),
    },
    {
        id: 3,
        illustration: <TransactionsPassphraseIcon />,
        heading: (
            <Heading level={3} className='w-[257px] text-center'>
                Sign transactions and <br />
                perform on-chain actions.
            </Heading>
        ),
    },
];

export default Onboarding;
