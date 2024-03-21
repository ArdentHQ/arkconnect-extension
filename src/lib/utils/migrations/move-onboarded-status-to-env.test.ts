import { describe, expect, it, vi } from 'vitest';
import { moveOnboardedStatusToEnv } from './move-onboarded-status-to-env';
import { env } from '@/tests/mocks';
import { EnvironmentData } from '@/lib/background/contracts';

describe('move-onboarded-status-to-env', () => {
    it('should move onboarded flag from LS to env data', async () => {
        const moveFlag = moveOnboardedStatusToEnv(env);

        expect(env.data().get(EnvironmentData.HasOnboarded)).toBe(undefined);

        await moveFlag();
        expect(env.data().get(EnvironmentData.HasOnboarded)).toBe(true);
    });

    it('should not move onboarded flag from LS to env data if the flag already exists in env', async () => {
        const moveFlag = moveOnboardedStatusToEnv(env);
        const hasOnboardedMock = vi.spyOn(env.data(), 'get').mockReturnValue(false);

        expect(env.data().get(EnvironmentData.HasOnboarded)).toBe(false);

        await moveFlag();
        expect(env.data().get(EnvironmentData.HasOnboarded)).toBe(false);
        hasOnboardedMock.mockRestore();
    });
});
