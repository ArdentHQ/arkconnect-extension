import { describe, expect, it } from 'vitest';
import { generateReceiveUrl } from './generateReceiveURL';
import constants from '@/constants';

describe('generateReceiveURL', () => {
    const NET_HASH = '6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988';
    const ADDRESS = 'DFevNTiETrLt9qSD564sztapkofFd1YXQa';

    it('generates basic URL for mainnet', () => {
        const url = generateReceiveUrl({
            coinName: 'ARK',
            netHash: NET_HASH,
            address: ADDRESS,
        });

        expect(url).toBe(
            `${constants.ARKVAULT_BASE_URL}#/?method=transfer&recipient=${ADDRESS}&coin=ARK&nethash=${NET_HASH}`,
        );
    });

    it('generates basic URL for devnet', () => {
        const url = generateReceiveUrl({
            coinName: 'DARK',
            netHash: NET_HASH,
            address: ADDRESS,
        });

        expect(url).toBe(
            `${constants.ARKVAULT_BASE_URL}#/?method=transfer&recipient=${ADDRESS}&coin=DARK&nethash=${NET_HASH}`,
        );
    });

    it('generates URL with amount', () => {
        const url = generateReceiveUrl({
            coinName: 'ARK',
            netHash: NET_HASH,
            address: ADDRESS,
            amount: '100',
        });

        expect(url).toBe(
            `${constants.ARKVAULT_BASE_URL}#/?amount=100&method=transfer&recipient=${ADDRESS}&coin=ARK&nethash=${NET_HASH}`,
        );
    });

    it('generates URL with memo', () => {
        const url = generateReceiveUrl({
            coinName: 'ARK',
            netHash: NET_HASH,
            address: ADDRESS,
            memo: 'hello',
        });

        expect(url).toBe(
            `${constants.ARKVAULT_BASE_URL}#/?memo=hello&method=transfer&recipient=${ADDRESS}&coin=ARK&nethash=${NET_HASH}`,
        );
    });

    it('generates URL with amount and memo', () => {
        const url = generateReceiveUrl({
            coinName: 'ARK',
            netHash: NET_HASH,
            address: ADDRESS,
            amount: '100',
            memo: 'hello',
        });

        expect(url).toBe(
            `${constants.ARKVAULT_BASE_URL}#/?memo=hello&amount=100&method=transfer&recipient=${ADDRESS}&coin=ARK&nethash=${NET_HASH}`,
        );
    });

    it('generates URL with memo with spaces and encodes them', () => {
        const url = generateReceiveUrl({
            coinName: 'ARK',
            netHash: NET_HASH,
            address: ADDRESS,
            memo: 'this is a test',
        });

        expect(url).toBe(
            `${constants.ARKVAULT_BASE_URL}#/?memo=this+is+a+test&method=transfer&recipient=${ADDRESS}&coin=ARK&nethash=${NET_HASH}`,
        );
    });
});
