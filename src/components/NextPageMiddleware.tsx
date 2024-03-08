import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { runtime } from 'webextension-polyfill';
import { useIdleTimer } from 'react-idle-timer';
import { useNavigate } from 'react-router-dom';
import { getPersistedValues } from './wallet/form-persist';
import * as UIStore from '@/lib/store/ui';

import { LastScreen, ProfileData, ScreenName } from '@/lib/background/contracts';
import { useAppDispatch, useAppSelector } from '@/lib/store';

import { FlexContainer } from '@/shared/components';
import { HandleLoadingState } from '@/shared/components/handleStates/HandleLoadingState';
import { useProfileContext } from '@/lib/context/Profile';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { useBackgroundEvents } from '@/lib/context/BackgroundEventHandler';
import { selectWalletsLength } from '@/lib/store/wallet';

type Props = {
    children: ReactNode | ReactNode[];
};

const NextPageMiddleware = ({ children }: Props) => {
    const dispatch = useAppDispatch();
    const { currentThemeMode } = useThemeMode();
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
            navigate('/splash-screen');
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

        const lastScreen = profile.data().get(ProfileData.LastScreen) as LastScreen | undefined;

        if (lastScreen?.screenName === ScreenName.CreateWallet) {
            navigate('/wallet/create');
            return;
        }
    };

    return (
        <FlexContainer
            flexDirection='column'
            height='100vh'
            width='100vw'
            justifyContent='center'
            alignItems='center'
            bg={currentThemeMode === UIStore.ThemeMode.DARK ? 'lightBlack' : 'subtleWhite'}
        >
            <HandleLoadingState loading={isLoadingLocalData}>{children}</HandleLoadingState>
        </FlexContainer>
    );
};

export default NextPageMiddleware;
