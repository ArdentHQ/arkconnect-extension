import { useEffect, useState } from 'react';
import * as SessionStore from '@/lib/store/session';
import { useAppSelector } from '@/lib/store';
import browser from 'webextension-polyfill';
import { Contracts } from '@ardenthq/sdk-profiles';

const getCurrentTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await browser.tabs.query(queryOptions);
  return tab;
};

export const useActiveTabConnection = ({ wallet }: { wallet?: Contracts.IReadWriteWallet }) => {
  const [tabSession, setTabSession] = useState<SessionStore.Session | undefined>(undefined);

  const sessions = useAppSelector(SessionStore.selectSessions);

  useEffect(() => {
    if (!wallet) {
      return;
    }

    (async () => {
      const tab = await getCurrentTab();
      if (!tab) return;

      const connectedSession = Object.values(sessions).find(
        (session) => tab?.url?.includes(session.domain) && session.walletId === wallet.id(),
      );

      setTabSession(connectedSession);
    })();
  }, [wallet, sessions]);

  const getConnectedSiteData = () => {
    return {
      logo: tabSession?.logo ?? '',
      connectedTo: tabSession?.domain ?? '',
    };
  };

  return {
    tabSession,
    getConnectedSiteData,
  };
};
