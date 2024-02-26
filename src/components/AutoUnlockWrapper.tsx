import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileContext } from '@/lib/context/Profile';
import { HandleLoadingState } from '@/shared/components/handleStates/HandleLoadingState';
import { FlexContainer } from '@/shared/components';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import * as UIStore from '@/lib/store/ui';
import useThemeMode from '@/lib/hooks/useThemeMode';
import { getPersistedValues } from './wallet/form-persist';
import { useIdleTimer } from 'react-idle-timer';
import browser from 'webextension-polyfill';

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

const AutoUnlockWrapper = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const { currentThemeMode } = useThemeMode();
  const { persistScreen } = getPersistedValues();
  const { profile, isProfileReady } = useProfileContext();
  const navigate = useNavigate();
  const [isLoadingLocalData, setIsLoadingLocalData] = useState<boolean>(true);
  const locked = useAppSelector(UIStore.selectLocked);

  useLayoutEffect(() => {
    const checkLocked = async () => {
      const status = await browser.runtime.sendMessage({ type: 'CHECK_LOCK' });

      dispatch(UIStore.lockedChanged(status.isLocked));
    };

    void checkLocked();
  }, [locked]);

  useEffect(() => {
    handleAutoLockNavigation();
    setIsLoadingLocalData(false);

    handlePersistScreenRedirect();
    handleLedgerNavigation();
  }, [locked, profile.id()]);

  useIdleTimer({
    throttle: 1000,
    onAction: () => {
      browser.runtime.sendMessage({ type: 'REGISTERED_ACTIVITY' });
    },
    disabled: locked,
  });

  const handleLedgerNavigation = () => {
    const locationHref = window.location.href;

    if (!locationHref.includes('import_with_ledger')) return;
    navigate('/ledger-import');
  };

  const handlePersistScreenRedirect = () => {
    if (!persistScreen) return;
    navigate(persistScreen.screen);
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
