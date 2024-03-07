import { createContext, ReactNode, useContext } from 'react';
import { Event } from "@/lib/hooks/useBackgroundEventHandler";

interface Context {
    events: Event[];
    runEventHandlers: () => number;
}

interface Properties {
    children: ReactNode;
    runEventHandlers: () => number;
    events: Event[];
}

const BackgroundEventsContext = createContext<Context | undefined>(undefined);

export const BackgroundEvents = ({ children, events, runEventHandlers }: Properties) => {

    return (
        <BackgroundEventsContext.Provider
            value={{
                events,
                runEventHandlers,
            }}
        >
            {children}
        </BackgroundEventsContext.Provider>
    );
};

export const useBackgroundEvents = (): Context => {
    const value = useContext(BackgroundEventsContext);

    if (value === undefined) {
        throw new Error('[useBackgroundEvents] Component not wrapped within a Provider');
    }

    return value;
};
