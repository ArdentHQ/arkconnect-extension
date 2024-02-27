import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';
import { revertAll } from '../ui';
import { RootState } from '@/lib/store';

export type Session = {
  id: string;
  domain: string;
  logo: string;
  createdAt: string;
  walletId: string;
};

export type SessionEntries = { [id: string]: Session };

type SessionState = {
  sessions: SessionEntries;
};

const initialState: SessionState = {
  sessions: {},
};

const saveSessions = async (sessions: SessionEntries) => {
  await browser.runtime.sendMessage({
    type: 'SET_SESSIONS',
    data: { sessions },
  });
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    sessionAdded: (state, action: PayloadAction<Session>) => {
      state.sessions[action.payload.id] = action.payload;
    },

    sessionRemoved: (state, action: PayloadAction<string | string[]>) => {
      for (const sessionId of action.payload) {
        delete state.sessions[sessionId];
      }
    },

    sessionsLoaded: (state, action: PayloadAction<SessionEntries>) => {
      state.sessions = action.payload;
    },
  },
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
});

export const sessionsLoaded = createAsyncThunk(
  'session/sessionsLoaded',
  async (sessions: SessionEntries, { dispatch }) => {
    dispatch(sessionSlice.actions.sessionsLoaded(sessions));
  },
);

export const selectSessions = (state: RootState) => state.session.sessions;

export const sessionAdded = createAsyncThunk(
  'session/sessionAdded',
  async (session: Session, { getState, dispatch }) => {
    dispatch(sessionSlice.actions.sessionAdded(session));

    const state = getState() as RootState;

    await saveSessions(state.session.sessions);
  },
);

export const sessionRemoved = createAsyncThunk(
  'session/sessionRemoved',
  async (sessionIds: string[], { getState, dispatch }) => {
    dispatch(sessionSlice.actions.sessionRemoved(sessionIds));

    const state = getState() as RootState;

    await saveSessions(state.session.sessions);
  },
);

export default sessionSlice.reducer;
