import { beforeEach, describe, expect, it } from 'vitest';
import { ProfileValidator } from '@/lib/profiles/profile.validator';
import { ProfileData, ProfileSetting } from '@/lib/profiles/contracts';

const validSettings = (): Record<string, unknown> => ({
    [ProfileSetting.AutomaticSignOutPeriod]: 15,
    [ProfileSetting.Bip39Locale]: 'english',
    [ProfileSetting.DoNotShowFeeWarning]: false,
    [ProfileSetting.ExchangeCurrency]: 'BTC',
    [ProfileSetting.Locale]: 'en-US',
    [ProfileSetting.MarketProvider]: 'cryptocompare',
    [ProfileSetting.Name]: 'Test',
    [ProfileSetting.Theme]: 'light',
    [ProfileSetting.TimeFormat]: 'h:mm A',
});

const validProfile = () => ({
    id: 'test-id',
    data: {},
    hosts: {},
    networks: {},
    settings: validSettings(),
    wallets: {},
});

describe('ProfileValidator', () => {
    let validator: ProfileValidator;

    beforeEach(() => {
        validator = new ProfileValidator();
    });

    it('accepts a valid minimal profile', () => {
        expect(() => validator.validate(validProfile())).not.toThrow();
    });

    it('throws when a required setting is missing', () => {
        const profile = validProfile();
        delete (profile.settings as any)[ProfileSetting.Name];

        expect(() => validator.validate(profile)).toThrow();
    });

    it('throws when id is missing', () => {
        const profile = { ...validProfile(), id: undefined } as any;

        expect(() => validator.validate(profile)).toThrow();
    });

    it('strips unknown top-level fields', () => {
        const profile = { ...validProfile(), pendingMusigWallets: { someKey: {} } } as any;

        const result = validator.validate(profile);

        expect(result).not.toHaveProperty('pendingMusigWallets');
    });

    it('strips unknown setting fields', () => {
        const profile = validProfile();
        (profile.settings as any)['USE_HD_WALLETS'] = true;

        const result = validator.validate(profile);

        expect(result.settings).not.toHaveProperty('USE_HD_WALLETS');
    });

    it('strips migration result fields', () => {
        const profile = validProfile();
        (profile.data as any)[ProfileData.LatestMigration] = '0.0.1';
        (profile.data as any)['MIGRATION_RESULT'] = { coldAddresses: [], mergedAddresses: [] };

        const result = validator.validate(profile);

        expect(result.data).not.toHaveProperty('MIGRATION_RESULT');
        expect(result.data[ProfileData.LatestMigration]).toBe('0.0.1');
    });

    it('accepts a wallet entry in the wallets map', () => {
        const profile = {
            ...validProfile(),
            wallets: {
                'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee': {
                    id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
                    data: {},
                    settings: {},
                },
            },
        };

        expect(() => validator.validate(profile)).not.toThrow();
    });
});
