import {
    Button,
    ControlConnectionsIcon,
    FingerPrintIcon,
    Header,
    Heading,
    Icon,
    ProgressBar,
    TransactionsPassphraseIcon,
} from '@/shared/components';
import { ReactNode, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import cn from 'classnames';
import constants from '@/constants';
import { ShortcutIcon } from '@/shared/components/icon/illustration/ShortcutIcon';
import { useNavigate } from 'react-router-dom';
import { useOs } from '@/lib/hooks/useOs';

type OnboardingScreen = {
    id: number;
    illustration: ReactNode;
    heading: ReactNode;
};

const Onboarding = () => {
    const { t } = useTranslation();
    const { os } = useOs();

    const navigate = useNavigate();

    const [activeOnboardingScreen, setActiveOnboardingScreen] = useState<number>(0);

    const onboardingScreens: OnboardingScreen[] = [
        {
            id: 1,
            illustration: <FingerPrintIcon />,
            heading: (
                <Heading level={3} className='w-[256px] text-center'>
                    <Trans i18nKey='PAGES.ONBOARDING.SCREEN_HEADINGS.EASILY_SECURE' />
                </Heading>
            ),
        },
        {
            id: 2,
            illustration: <ControlConnectionsIcon />,
            heading: (
                <Heading level={3} className='w-[297px] text-center'>
                    <Trans i18nKey='PAGES.ONBOARDING.SCREEN_HEADINGS.CONTROL_YOUR_IDENTITY' />
                </Heading>
            ),
        },
        {
            id: 3,
            illustration: <TransactionsPassphraseIcon />,
            heading: (
                <Heading level={3} className='w-[257px] text-center'>
                    <Trans i18nKey='PAGES.ONBOARDING.SCREEN_HEADINGS.SIGN_TRANSACTIONS' />
                </Heading>
            ),
        },
        {
            id: 4,
            illustration: <ShortcutIcon />,
            heading: (
                <Heading level={3} className='w-[300px] text-center'>
                    <Trans
                        i18nKey={
                            os === constants.MAC_OS
                                ? 'PAGES.ONBOARDING.SCREEN_HEADINGS.SHORTCUT.MAC'
                                : 'PAGES.ONBOARDING.SCREEN_HEADINGS.SHORTCUT.DEFAULT'
                        }
                    />
                </Heading>
            ),
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveOnboardingScreen((prevIndex) => (prevIndex + 1) % onboardingScreens.length);
        }, 5000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const goToNextScreen = () => {
        setActiveOnboardingScreen((prevIndex) => (prevIndex + 1) % onboardingScreens.length);
    };

    const goToPreviousScreen = () => {
        setActiveOnboardingScreen(
            (prevIndex) => (prevIndex - 1 + onboardingScreens.length) % onboardingScreens.length,
        );
    };

    return (
        <div className='fade pt-[58px] duration-1000 ease-in-out'>
            <Header />
            <ProgressBar itemsLength={onboardingScreens.length} />
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
                        <div className='absolute left-4 top-1/2'>
                            <button
                                onClick={() => goToPreviousScreen()}
                                className='h-6 w-6 rounded-full text-theme-secondary-500 transition hover:bg-theme-secondary-100 hover:text-black dark:text-theme-secondary-300 dark:hover:bg-theme-secondary-700 dark:hover:text-white'
                            >
                                <Icon icon='chevron-left' className='h-6 w-6' />
                            </button>
                        </div>
                        <div className='absolute right-4 top-1/2'>
                            <button
                                onClick={() => goToNextScreen()}
                                className='h-6 w-6 rounded-full text-theme-secondary-500 transition hover:bg-theme-secondary-100 hover:text-black dark:text-theme-secondary-300 dark:hover:bg-theme-secondary-700 dark:hover:text-white'
                            >
                                <Icon icon='chevron-right' className='h-6 w-6' />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex flex-col gap-3 px-4'>
                <Button variant='primary' onClick={() => navigate('/wallet/create')}>
                    {t('PAGES.ONBOARDING.CREATE_NEW_ADDRESS')}
                </Button>
                <Button variant='secondary' onClick={() => navigate('/wallet')}>
                    {t('PAGES.ONBOARDING.IMPORT_AN_ADDRESS')}
                </Button>
            </div>
        </div>
    );
};

export default Onboarding;
