import * as UIStore from '@/lib/store/ui';

import { LastVisitedPage, ProfileData, ScreenName } from '@/lib/background/contracts';
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store';

import { HandleLoadingState } from '@/shared/components/handleStates/HandleLoadingState';
import { getPersistedValues } from './wallet/form-persist';
import { runtime } from 'webextension-polyfill';
import { selectWalletsLength } from '@/lib/store/wallet';
import { useBackgroundEvents } from '@/lib/context/BackgroundEventHandler';
import { useIdleTimer } from 'react-idle-timer';
import { useNavigate } from 'react-router-dom';
import { useProfileContext } from '@/lib/context/Profile';

type Props = {
    children: ReactNode | ReactNode[];
};

const NextPageMiddleware = ({ children }: Props) => {
    const dispatch = useAppDispatch();
    const { persistScreen } = getPersistedValues();
    const { profile, isProfileReady } = useProfileContext();
    const navigate = useNavigate();
    const [isLoadingLocalData, setIsLoadingLocalData] = useState<boolean>(true);
    const locked = useAppSelector(UIStore.selectLocked);
    const hasWallets = useAppSelector(selectWalletsLength) > 0;
    const autoLockTimerDisabled = locked || !hasWallets;

    useLayoutEffect(() => {
        const checkLocked = async () => {
            const status = await runtime.sendMessage({ type: 'CHECK_LOCK' });

            dispatch(UIStore.lockedChanged(status.isLocked));
        };

        void checkLocked();
    }, [locked]);

    const { runEventHandlers } = useBackgroundEvents();

    useEffect(() => {
        handleNavigation();
        setIsLoadingLocalData(false);

        handleLedgerNavigation();
    }, [runEventHandlers, locked, profile.id()]);

    useIdleTimer({
        throttle: 1000,
        onAction: () => {
            void runtime.sendMessage({ type: 'REGISTER_ACTIVITY' });
        },
        disabled: autoLockTimerDisabled,
    });

    useEffect(() => {
        if (autoLockTimerDisabled) {
            runtime.sendMessage({ type: 'CLEAR_AUTOLOCK_TIMER' });
            return;
        }
    }, [autoLockTimerDisabled]);

    const handleLedgerNavigation = () => {
        const locationHref = window.location.href;

        if (locationHref.includes('import_with_ledger')) {
            navigate('/ledger-import', {
                state: {
                    isTestnet: locationHref.includes('isTestnet'),
                },
            });
        }
    };

    const runningHandlers = useRef(false);

    const handleNavigation = () => {
        if (locked) {
            navigate('/enter-password');
            return;
        }

        if (isProfileReady && profile.wallets().count() === 0) {
            const lastVisitedPage = profile.settings().get(ProfileData.LastVisitedPage) as
                | LastVisitedPage
                | undefined;

            lastVisitedPage || persistScreen ? navigate('/onboarding') : navigate('/splash-screen');

            // This is needed to push an additional route to the history stack
            // to handle the back button navigation during onboarding
            if (lastVisitedPage) {
                navigate('/wallet/create');
                return;
            }

            persistScreen && navigate(persistScreen.screen);
            return;
        }

        // If an action is triggered while a screen is persisted, we should
        // display the action screen in the opened window. However, once the
        // registered event handlers run, the 'events' state will be reset,
        // causing this function to re-trigger due to the nature of 'useEffect'.
        // This would navigate the user away from the action screen, which is
        // not ideal.To ensure good UX, we manually skip the next checks using
        // the 'runningHandlers' flag.
        if (runningHandlers.current || runEventHandlers()) {
            runningHandlers.current = true;

            setTimeout(() => {
                runningHandlers.current = false;
            }, 2000);

            return;
        }

        if (persistScreen) {
            navigate(persistScreen.screen);
            return;
        }

        const lastVisitedPage = profile.settings().get(ProfileData.LastVisitedPage) as
            | LastVisitedPage
            | undefined;

        if (lastVisitedPage?.name === ScreenName.CreateWallet) {
            navigate('/wallet/create');
            return;
        }
    };

    return (
        <div className='flex h-screen w-screen flex-col items-center justify-center bg-light-black dark:bg-subtle-white'>
            <HandleLoadingState loading={isLoadingLocalData}>{children}</HandleLoadingState>
        </div>
    );
};

export default NextPageMiddleware;
