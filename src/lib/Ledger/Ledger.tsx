import { createContext, ReactNode, useContext } from 'react';

import { useLedgerConnection } from './hooks/connection';

interface Properties {
    children: ReactNode;
}

const LedgerContext = createContext<any>(undefined);

export const LedgerProvider = ({ children }: Properties) => (
    <LedgerContext.Provider value={useLedgerConnection()}>{children}</LedgerContext.Provider>
);

export const useLedgerContext = (): ReturnType<typeof useLedgerConnection> =>
    useContext(LedgerContext);
