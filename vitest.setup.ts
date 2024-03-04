import { getPasswordProtectedProfileId } from './src/tests/fixtures';
import { bootEnvironmentWithProfileFixtures } from './src/tests/helpers';
import { LocalStorageServiceState } from './src/lib/services/LocalStorageService.ts';
import { env } from './src/tests/mocks';
import { MockInstance, afterEach, beforeAll, beforeEach } from 'vitest';
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
    getLocalValues: () => ({
        encryptionIV: 'encryptionIV',
        passwordHash: 'passwordHash',
        password: 'password',
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

vi.mock('./src/lib/services/LocalStorageService', () => {
    const data: LocalStorageServiceState = {
        wallets: [
            {
                walletId: 'wallet-id',
                passphrase: ['mnemonic'],
            },
        ],
        sessions: {
            'session-id': {
                id: 'session-id',
                domain: 'https://domain.com',
                logo: 'https://domain.com/logo.png',
                createdAt: '2024-01-01T00:00:00.000Z',
                walletId: 'wallet-id',
            },
        },
        primaryWalletId: getPasswordProtectedProfileId(),
    };

    return {
        default: class LocalStorageService {
            setEncryptionKey = vi.fn();
            setEncryptionIV = vi.fn();
            updateEncryption = vi.fn();
            encrypt = vi.fn().mockReturnValue('encrypted');
            decrypt = vi.fn().mockReturnValue(data);
            getData = vi.fn().mockReturnValue(data);
            setData = vi.fn();
            removeData = vi.fn();
        },
    };
});

beforeAll(async () => {
    await bootEnvironmentWithProfileFixtures({ env, shouldRestoreDefaultProfile: true });
});

let useProfileContextMock: MockInstance;

beforeEach(() => {
    const profile = env.profiles().findById(getPasswordProtectedProfileId());

    useProfileContextMock = vi.spyOn(ProfileMock, 'useProfileContext').mockReturnValue({
        profile,
        restoreWithPassword: vi.fn(),
        loadLocalData: vi.fn(),
        initProfile: vi.fn(),
        convertedBalance: 0,
    });
});

afterEach(() => {
    useProfileContextMock.mockRestore();
});
