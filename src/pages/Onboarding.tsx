import { ReactNode, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import constants from '@/constants';
import { ShortcutIcon } from '@/shared/components/icon/illustration/ShortcutIcon';
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

    const interval = useRef<ReturnType<typeof setInterval> | undefined>();

    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [filledSegments, setFilledSegments] = useState<boolean[]>(Array(4).fill(false));

    const onboardingScreens: OnboardingScreen[] = [
        {
            id: 0,
            illustration: <FingerPrintIcon />,
            heading: (
                <Heading level={3} className='w-[256px] text-center'>
                    <Trans i18nKey='PAGES.ONBOARDING.SCREEN_HEADINGS.EASILY_SECURE' />
                </Heading>
            ),
        },
        {
            id: 1,
            illustration: <ControlConnectionsIcon />,
            heading: (
                <Heading level={3} className='w-[297px] text-center'>
                    <Trans i18nKey='PAGES.ONBOARDING.SCREEN_HEADINGS.CONTROL_YOUR_IDENTITY' />
                </Heading>
            ),
        },
        {
            id: 2,
            illustration: <TransactionsPassphraseIcon />,
            heading: (
                <Heading level={3} className='w-[257px] text-center'>
                    <Trans i18nKey='PAGES.ONBOARDING.SCREEN_HEADINGS.SIGN_TRANSACTIONS' />
                </Heading>
            ),
        },
        {
            id: 3,
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
        interval.current = setInterval(() => {
            goToNextScreen();
        }, 5000);
        return () => {
            clearInterval(interval.current);
        };
    }, []);

    const resetInterval = () => {
        clearInterval(interval.current);
        interval.current = setInterval(() => {
            goToNextScreen();
        }, 5000);
    };

    const goToNextScreen = () => {
        setActiveIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % onboardingScreens.length;
            const newFilledSegments = Array(onboardingScreens.length)
                .fill(false)
                .map((_, idx) => idx <= newIndex);
            setFilledSegments(newFilledSegments);
            return newIndex;
        });
        resetInterval();
    };

    const goToPreviousScreen = () => {
        setActiveIndex((prevIndex) => {
            const newIndex = (prevIndex - 1 + onboardingScreens.length) % onboardingScreens.length;
            const newFilledSegments = Array(onboardingScreens.length)
                .fill(false)
                .map((_, idx) => idx <= newIndex);
            setFilledSegments(newFilledSegments);
            return newIndex;
        });
        resetInterval();
    };

    return (
        <div className='fade pt-[58px] duration-1000 ease-in-out'>
            <Header />
            <ProgressBar activeIndex={activeIndex} filledSegments={filledSegments} />
            <div className='relative h-[410px]'>
                <div className='absolute left-4 top-1/2 z-1'>
                    <button
                        onClick={() => goToPreviousScreen()}
                        className='h-6 w-6 rounded-full text-theme-secondary-500 transition hover:bg-theme-secondary-100 hover:text-black dark:text-theme-secondary-300 dark:hover:bg-theme-secondary-700 dark:hover:text-white'
                    >
                        <Icon icon='chevron-left' className='h-6 w-6' />
                    </button>
                </div>
                <div className='absolute right-4 top-1/2 z-1 '>
                    <button
                        onClick={() => goToNextScreen()}
                        className='h-6 w-6 rounded-full text-theme-secondary-500 transition hover:bg-theme-secondary-100 hover:text-black dark:text-theme-secondary-300 dark:hover:bg-theme-secondary-700 dark:hover:text-white'
                    >
                        <Icon icon='chevron-right' className='h-6 w-6' />
                    </button>
                </div>
                {onboardingScreens.map((screen, index) => (
                    <div
                        className={cn(
                            'absolute left-0 top-[70px] flex w-full items-center justify-center gap-6 px-9 transition-all duration-1000 ease-in-out',
                            {
                                'translate-x-0 opacity-100': activeIndex === index,
                                '-translate-x-full opacity-0': activeIndex > index,
                                'translate-x-full opacity-0': activeIndex < index,
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
