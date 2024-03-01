import { afterAll, beforeAll, describe, expect, it, MockInstance, vi } from 'vitest';
import requestPermission from './requestPermission';

let globalNaviatorSpy: MockInstance;

describe('requestPermission', () => {
    beforeAll(() => {
        globalNaviatorSpy = vi.spyOn(global, 'navigator', 'get').mockReturnValue({
            permissions: {
                query: vi.fn(),
            },
        } as any);
    });

    afterAll(() => {
        globalNaviatorSpy.mockRestore();
    });

    it.each(['geolocation', 'clipboard-read', 'clipboard-write'])(
        'requests permissions',
        async (permission: any) => {
            await requestPermission(permission);
            expect(navigator.permissions.query).toHaveBeenCalledWith({ name: permission });
        },
    );
});
