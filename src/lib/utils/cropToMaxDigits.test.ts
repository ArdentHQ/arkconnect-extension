import { describe, expect, it, vi } from 'vitest';
import { Helpers } from '@ardenthq/sdk-profiles';
import cropToMaxDigits from './cropToMaxDigits';

describe('cropToMaxDigits', () => {
    it('crops number decimals to max digits', () => {
        const result = cropToMaxDigits({
            value: 3.14159265359,
            ticker: 'ARK',
            maxDigits: 4,
            withTicker: false,
        });
        expect(result).toBe('3.141');
    });

    it('crops number decimals to max digits with a integer', () => {
        const result = cropToMaxDigits({
            value: 1,
            ticker: 'ARK',
            maxDigits: 0,
            withTicker: true,
        });
        expect(result).toBe('1 ARK');
    });

    it('crops number decimals to max digits with ticker', () => {
        const result = cropToMaxDigits({
            value: 3.14159265359,
            ticker: 'ARK',
            maxDigits: 4,
            withTicker: true,
        });

        expect(result).toBe('3.141 ARK');
    });

    it('crops number decimals to max digits with ticker for a locale that uses spaces as separator and comma as decimal (with ticker)', () => {
        const currencyFormatSpy = vi
            .spyOn(Helpers.Currency, 'format')
            // returns 1,1 instead of 1.1 (as in `fr-FR` locale)
            .mockReturnValueOnce('1,1')
            // returns 1 234 567,892 instead of 1,234,567.892 (as in `fr-FR` locale)
            .mockReturnValueOnce('1 234 567,891511')
            // returns 1 234 567,892 again but now with ticker
            .mockReturnValueOnce('1 234 567,891511 ARK');

        const result = cropToMaxDigits({
            value: 1234567.891511,
            ticker: 'ARK',
            maxDigits: 12,
            withTicker: true,
        });

        expect(result).toBe('1 234 567,891 ARK');

        currencyFormatSpy.mockRestore();
    });

    it('crops number decimals to max digits with ticker for a locale that uses dots as separator and comma as decimal (with ticker)', () => {
        const currencyFormatSpy = vi
            .spyOn(Helpers.Currency, 'format')
            // returns 1,1 instead of 1.1 (as in `de-DE` locale)
            .mockReturnValueOnce('1,1')
            // returns 1.234.567,892 instead of 1,234,567.892 (as in `de-DE` locale)
            .mockReturnValueOnce('1.234.567,892')
            // returns 1.234.567,892 again but now with ticker
            .mockReturnValueOnce('1.234.567,892 ARK');

        const result = cropToMaxDigits({
            value: 1234567.891511,
            ticker: 'ARK',
            maxDigits: 12,
            withTicker: true,
        });

        expect(result).toBe('1.234.567,892 ARK');

        currencyFormatSpy.mockRestore();
    });

    it('crops number decimals to max digits with prefix ticker for a locale that uses spaces as separator and comma as decimal (with ticker)', () => {
        const currencyFormatSpy = vi
            .spyOn(Helpers.Currency, 'format')
            // returns 1,1 instead of 1.1 (as in `fr-FR` locale)
            .mockReturnValueOnce('1,1')
            // returns 1 234 567,892 instead of 1,234,567.892 (as in `fr-FR` locale)
            .mockReturnValueOnce('1 234 567,891511')
            // returns 1 234 567,892 again but now with ticker
            .mockReturnValueOnce('$1 234 567,891511');

        const result = cropToMaxDigits({
            value: 1234567.891511,
            ticker: 'USD',
            maxDigits: 12,
            withTicker: true,
        });

        expect(result).toBe('$1 234 567,891');

        currencyFormatSpy.mockRestore();
    });

    it('crops number decimals to max digits with prefix ticker for a locale that uses dots as separator and comma as decimal (with ticker)', () => {
        const currencyFormatSpy = vi
            .spyOn(Helpers.Currency, 'format')
            // returns 1,1 instead of 1.1 (as in `de-DE` locale)
            .mockReturnValueOnce('1,1')
            // returns 1.234.567,892 instead of 1,234,567.892 (as in `de-DE` locale)
            .mockReturnValueOnce('1.234.567,892')
            // returns 1.234.567,892 again but now with ticker
            .mockReturnValueOnce('$1.234.567,892');

        const result = cropToMaxDigits({
            value: 1234567.891511,
            ticker: 'USD',
            maxDigits: 12,
            withTicker: true,
        });

        expect(result).toBe('$1.234.567,892');

        currencyFormatSpy.mockRestore();
    });

    it('crops number decimals to max digits with ticker for a locale that uses spaces as separator and comma as decimal (without ticker)', () => {
        const currencyFormatSpy = vi
            .spyOn(Helpers.Currency, 'format')
            // returns 1,1 instead of 1.1 (as in `fr-FR` locale)
            .mockReturnValueOnce('1,1')
            // returns 1 234 567,892 instead of 1,234,567.892 (as in `fr-FR` locale)
            .mockReturnValue('1 234 567,891511');

        const result = cropToMaxDigits({
            value: 1234567.891511,
            ticker: 'ARK',
            maxDigits: 12,
            withTicker: false,
        });

        expect(result).toBe('1 234 567,891');

        currencyFormatSpy.mockRestore();
    });

    it('crops number decimals to max digits with ticker for a locale that uses dots as separator and comma as decimal (without ticker)', () => {
        const currencyFormatSpy = vi
            .spyOn(Helpers.Currency, 'format')
            // returns 1,1 instead of 1.1 (as in `de-DE` locale)
            .mockReturnValueOnce('1,1')
            // returns 1.234.567,892 instead of 1,234,567.892 (as in `de-DE` locale)
            .mockReturnValue('1.234.567,892');

        const result = cropToMaxDigits({
            value: 1234567.891511,
            ticker: 'ARK',
            maxDigits: 12,
            withTicker: false,
        });

        expect(result).toBe('1.234.567,892');

        currencyFormatSpy.mockRestore();
    });

    it('crops number decimals to max digits considering commas when formatted', () => {
        const result = cropToMaxDigits({
            value: 1234567.891511,
            ticker: 'ARK',
            maxDigits: 12,
            withTicker: false,
        });

        expect(result).toBe('1,234,567.891');
    });

    it('crops number decimals to max digits for small number', () => {
        const result = cropToMaxDigits({
            value: 1e-8,
            ticker: 'ARK',
            maxDigits: 9,
            withTicker: false,
        });

        expect(result).toBe('0.00000001');
    });

    it('crops number decimals to max digits for a number without decimals', () => {
        const result = cropToMaxDigits({
            value: 123456,
            ticker: 'ARK',
            maxDigits: 9,
            withTicker: false,
        });

        expect(result).toBe('123,456');
    });

    it('crops number decimals to max digits for zero', () => {
        const result = cropToMaxDigits({
            value: 0,
            ticker: 'ARK',
            maxDigits: 9,
            withTicker: false,
        });

        expect(result).toBe('0');
    });

    it('crops number decimals to max digits considering commas when formatted if no space for decimals', () => {
        const result = cropToMaxDigits({
            value: 1234567.891011,
            ticker: 'ARK',
            maxDigits: 9,
            withTicker: false,
        });

        expect(result).toBe('1,234,567');
    });

    it('does not crops number decimals if max digits are enough', () => {
        const result = cropToMaxDigits({
            value: 3.14159,
            ticker: 'ARK',
            maxDigits: 6,
            withTicker: false,
        });
        expect(result).toBe('3.14159');
    });

    it('crops number decimals to max digits for amounts with ticker prefix', () => {
        const result = cropToMaxDigits({
            value: 12345.891011,
            ticker: 'USD',
            maxDigits: 9,
            withTicker: true,
        });

        expect(result).toBe('$12,345.89');
    });

    it('formats standard numbers correctly without ticker', () => {
        expect(cropToMaxDigits({ value: 123.45 })).toBe('123.45');
    });

    it('formats standard numbers correctly with other ticker', () => {
        expect(cropToMaxDigits({ value: 123.45, withTicker: true, ticker: 'MXN' })).toBe(
            'MX$123.45',
        );
    });

    it('abbreviates large numbers correctly without ticker', () => {
        expect(cropToMaxDigits({ value: 1234567 })).toBe('1,234,567');
    });

    it.each([
        [1, '1'],
        [12, '12'],
        [123, '123'],
        [1_234, '1,234'],
        [12_345, '12.3K'],
        [123_456, '123.4K'],
        [1_234_567, '1.2M'],
        [12_345_678, '12.3M'],
        [123_456_890, '123.4M'],
        [12_345_678_901, '12.3B'],
        [123_456_789_012, '123.4B'],
        [1_234_567_890_123, '1.2T'],
        [12_345_678_901_234, '12.3T'],
    ])('respects maxDigits parameter with %d', (value, expected) => {
        expect(cropToMaxDigits({ value, maxDigits: 5 })).toBe(expected);
    });

    it('removes decimals if integers does not fit max digits', () => {
        expect(cropToMaxDigits({ value: 19100.37336381, maxDigits: 5 })).toBe('19.1K');
    });

    it.each([
        [9, '9'],
        [99, '99'],
        [999, '999'],
        [9_999, '9,999'],
        [99_999, '99.9K'],
        [999_999, '999.9K'],
        [9_999_999, '9.9M'],
        [99_999_999, '99.9M'],
        [999_999_999, '999.9M'],
        [99_999_999_999, '99.9B'],
        [999_999_999_999, '999.9B'],
        [9_999_999_999_999, '9.9T'],
        [99_999_999_999_999, '99.9T'],
    ])('respects maxDigits parameter with %d and rounds down', (value, expected) => {
        expect(cropToMaxDigits({ value, maxDigits: 5 })).toBe(expected);
    });
});
