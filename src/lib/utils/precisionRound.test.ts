import { it, describe, expect } from 'vitest';
import { precisionRound } from './precisionRound';

describe('precisionRound', () => {
    it('rounds to nearest integer with precision 0', () => {
        expect(precisionRound(12.345, 0)).toBe(12);
        expect(precisionRound(12.567, 0)).toBe(13);
    });

    it('rounds to one decimal place', () => {
        expect(precisionRound(12.345, 1)).toBe(12.3);
        expect(precisionRound(12.555, 1)).toBe(12.6);
    });

    it('rounds to two decimal places', () => {
        expect(precisionRound(12.3456, 2)).toBe(12.35);
        expect(precisionRound(12.554, 2)).toBe(12.55);
    });

    it('handles negative numbers', () => {
        expect(precisionRound(-12.345, 2)).toBe(-12.34);
        expect(precisionRound(-12.555, 1)).toBe(-12.6);
    });

    it('handles zero precision correctly', () => {
        expect(precisionRound(123.456, 0)).toBe(123);
    });

    it('handles large precision values', () => {
        expect(precisionRound(123.456789, 5)).toBe(123.45679);
    });
});
