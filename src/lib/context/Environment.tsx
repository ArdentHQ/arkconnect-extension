import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { Environment } from '@ardenthq/sdk-profiles';

interface Context {
    env: Environment;
    state?: Record<string, unknown>;
    persist: () => Promise<void>;
    isEnvironmentBooted: boolean;
    setIsEnvironmentBooted: (isBooted: boolean) => void;
}

interface Properties {
    children: ReactNode;
    env: Environment;
}

const EnvironmentContext = createContext<Context | undefined>(undefined);

export const EnvironmentProvider = ({ children, env }: Properties) => {
    const [state, setState] = useState<any>(undefined);
    const [isEnvironmentBooted, setIsEnvironmentBooted] = useState<boolean>(false);

    const persist = useCallback(async () => {
        await env.persist();

        // Force update
        setState({});
    }, [env]);

    return (
        <EnvironmentContext.Provider
            value={{
                env,
                isEnvironmentBooted,
                state,
                persist,
                setIsEnvironmentBooted,
            }}
        >
            {children}
        </EnvironmentContext.Provider>
    );
};

/**
 * If you needs to react to changes in the environment state
 * use the `state` field that will be updated whenever env.persist() is called:
 *
 * const context = useEnvironmentContext();
 * const profiles = useMemo(() => context.env.profiles().values(), [context]);
 */

export const useEnvironmentContext = (): Context => {
    const value = useContext(EnvironmentContext);
    if (value === undefined) {
        throw new Error('[useEnvironment] Component not wrapped within a Provider');
    }
    return value;
};
