import { beforeEach, describe, expect, it } from 'vitest';
import { ProfileFeeService } from '@/lib/profiles/fee.service';

describe('ProfileFeeService', () => {
    let service: ProfileFeeService;

    beforeEach(() => {
        service = new ProfileFeeService();
    });

    describe('all', () => {
        it('throws when fees have not been synced for the network', () => {
            expect(() => service.all('mainsail.mainnet')).toThrow(
                'The fees for [mainsail.mainnet] have not been synchronized yet.',
            );
        });

        it('accepts only a networkId (no coin argument)', () => {
            expect(() => service.all('mainsail.devnet')).toThrow(
                'The fees for [mainsail.devnet] have not been synchronized yet.',
            );
        });
    });

    describe('findByType', () => {
        it('throws when fees have not been synced', () => {
            expect(() => service.findByType('mainsail.mainnet', 'transfer')).toThrow(
                'The fees for [mainsail.mainnet] have not been synchronized yet.',
            );
        });
    });
});
