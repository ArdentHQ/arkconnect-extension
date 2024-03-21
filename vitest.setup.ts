import { getPasswordProtectedProfileId } from './src/tests/fixtures';
import { bootEnvironmentWithProfileFixtures } from './src/tests/helpers';
import { env } from './src/tests/mocks';
import { MockInstance, afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { vi } from 'vitest';
import * as ProfileMock from './src/lib/context/Profile';

process.env.REACT_APP_IS_UNIT = '1';

vi.mock('webextension-polyfill', () => {
    const browser = {
        runtime: {
            getPlatformInfo: vi.fn().mockReturnValue({ os: 'mac' }),
            onMessage: {
                addListener: vi.fn(),
            },
            onInstalled: {
                addListener: vi.fn(),
            },
            onConnect: {
                addListener: vi.fn(),
            },
            onStartup: {
                addListener: vi.fn(),
            },
            onSuspend: {
                addListener: vi.fn(),
            },
            getURL: vi.fn(),
            sendMessage: vi.fn().mockImplementation((args) => {
                if (args.type === 'CHECK_LOCK') {
                    return Promise.resolve({ isLocked: false });
                }

                return Promise.resolve({});
            }),
        },
    };

    return {
        default: browser,
        storage: {
            local: {
                get: async () => ({
                    localStorageKey: {
                        hasOnboarded: true,
                    },
                }),
            },
        },
    };
});

// Mock the environment module
vi.mock('./src/lib/utils/environment', () => ({
    initializeEnvironment: () => env,
}));

vi.mock('./src/routing', () => ({
    navigationRoutes: [],
    default: [],
}));

vi.mock('./src/lib/utils/localStorage', () => ({
    KEY: 'localStorageKey',
    getLocalValues: () => ({
        autoLockTimer: 60,
    }),
    setLocalValue: vi.fn(),
    clearLocalStorage: vi.fn(),
    AutoLockTimer: {
        FIFTEEN_MINUTES: 15,
        ONE_HOUR: 60,
        TWELVE_HOURS: 720,
        TWENTY_FOUR_HOURS: 1440,
    },
}));

beforeAll(async () => {
    await bootEnvironmentWithProfileFixtures({ env, shouldRestoreDefaultProfile: true });
});

let useProfileContextMock: MockInstance;

beforeEach(() => {
    const profile = env.profiles().findById(getPasswordProtectedProfileId());

    useProfileContextMock = vi.spyOn(ProfileMock, 'useProfileContext').mockReturnValue({
        profile,
        initProfile: vi.fn(),
        convertedBalance: 0,
        importProfile: vi.fn(),
        isProfileReady: true,
    });
});

afterEach(() => {
    useProfileContextMock.mockRestore();
});

afterAll(() => {
    // Run garbage collector after each test file is finished.
    if (global.gc) {
        global.gc();
    }
});
