import { EventPayload } from './eventListenerHandlers';
import { Contracts } from '@ardenthq/sdk-profiles';
import { ProfileData, SessionEntries } from './contracts';

export const assertIsUnlocked = (locked: boolean) => {
  if (locked) {
    throw new Error('Extension is locked, please unlock!');
  }
};

export const assertHasWallet = (profile: Contracts.IProfile | null) => {
  assertHasProfile(profile);

  if (profile!.wallets().count() === 0) {
    throw new Error('There is no available wallet to connect!');
  }
};

export const getActiveSession = <T>({
  payload,
  profile,
}: {
  payload: EventPayload<T>;
  profile: Contracts.IProfile | null;
}) => {
  if (!profile) {
    return false;
  }

  const sessions = profile.data().get(ProfileData.Sessions) as SessionEntries;

  if (!sessions) {
    return false;
  }

  const session = Object.values(sessions).find((session) => {
    return (
      session.domain === payload.data.domain &&
      session.walletId === profile?.data().get('PRIMARY_WALLET_ID')
    );
  });

  return session === undefined ? false : session;
};

export const assertIsConnected = <T>({
  payload,
  profile,
}: {
  payload: EventPayload<T>;
  profile: Contracts.IProfile | null;
}) => {
  if (getActiveSession({ payload, profile })) {
    throw new Error('Your domain is already connected!');
  }
};

export const assertIsNotConnected = <T>({
  payload,
  profile,
}: {
  payload: EventPayload<T>;
  profile: Contracts.IProfile | null;
}) => {
  const activeSession = getActiveSession({ payload, profile });

  if (!activeSession) {
    throw new Error('Your domain is not connected!');
  }

  return activeSession;
};

export const assertHasProfile = (profile: Contracts.IProfile | null) => {
  if (!profile) {
    throw new Error('Profile is not initialized!');
  }
};
