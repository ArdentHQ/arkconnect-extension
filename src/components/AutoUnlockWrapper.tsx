import { ReactNode, useEffect, useLayoutEffect, useState } from 'react';
import { runtime } from 'webextension-polyfill';
import { useIdleTimer } from 'react-idle-timer';
import { useNavigate } from 'react-router-dom';
import { getPersistedValues } from './wallet/form-persist';
import * as UIStore from '@/lib/store/ui';

import { LastVisitedPage, ProfileData, ScreenName } from '@/lib/background/contracts';
import { useAppDispatch, useAppSelector } from '@/lib/store';

import { FlexContainer } from '@/shared/components';
import { HandleLoadingState } from '@/shared/components/handleStates/HandleLoadingState';
import { useProfileContext } from '@/lib/context/Profile';
import useThemeMode from '@/lib/hooks/useThemeMode';

type Props = {
    children: ReactNode | ReactNode[];
    runEventHandlers: () => void;
};

const AutoUnlockWrapper = ({ children, runEventHandlers }: Props) => {
    const dispatch = useAppDispatch();
    const { currentThemeMode } = useThemeMode();
    const { persistScreen } = getPersistedValues();
    const { profile, isProfileReady } = useProfileContext();
    const navigate = useNavigate();
    const [isLoadingLocalData, setIsLoadingLocalData] = useState<boolean>(true);
    const locked = useAppSelector(UIStore.selectLocked);

    useLayoutEffect(() => {
        const checkLocked = async () => {
            const status = await runtime.sendMessage({ type: 'CHECK_LOCK' });

            dispatch(UIStore.lockedChanged(status.isLocked));
        };

        void checkLocked();
    }, [locked]);

    useEffect(() => {
        handleAutoLockNavigation();
        setIsLoadingLocalData(false);

        handlePersistScreenRedirect();
        handleLedgerNavigation();
    }, [runEventHandlers, locked, profile.id()]);

    useIdleTimer({
        throttle: 1000,
        onAction: () => {
            runtime.sendMessage({ type: 'REGISTER_ACTIVITY' });
        },
        disabled: locked,
    });

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

    const handlePersistScreenRedirect = () => {
        if (persistScreen) {
            navigate(persistScreen.screen);
            return;
        }

        const lastVisitedPage = profile.settings().get(ProfileData.LastVisitedPage) as
            | LastVisitedPage
            | undefined;

        if (!lastVisitedPage) {
            return;
        }

        if (lastVisitedPage.name === ScreenName.CreateWallet) {
            navigate('/wallet/create');
        }
    };

    const handleAutoLockNavigation = () => {
        if (locked) {
            navigate('/enter-password');
            return;
        }

        if (isProfileReady && profile.wallets().count() === 0) {
            navigate('/splash-screen');
            return;
        }

        runEventHandlers();
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

export default AutoUnlockWrapper;
