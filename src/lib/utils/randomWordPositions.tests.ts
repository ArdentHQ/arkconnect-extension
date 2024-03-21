import { describe, expect, it } from 'vitest';
import randomWordPositions from './randomWordPositions';

describe('randomWordPositions', () => {
    it('generates 3 unique random positions', () => {
        const positions = randomWordPositions(10);
        expect(positions).toHaveLength(3);
        expect(new Set(positions).size).toBe(3);
    });

    it('positions are within the length range', () => {
        const length = 10;
        const positions = randomWordPositions(length);
        positions.forEach((position) => {
            expect(position).toBeGreaterThanOrEqual(1);
            expect(position).toBeLessThanOrEqual(length);
        });
    });

    it('positions are sorted in ascending order', () => {
        const positions = randomWordPositions(10);
        expect(positions).toEqual([...positions].sort((a, b) => a - b));
    });

    it('handles smaller length', () => {
        expect(randomWordPositions(3)).toHaveLength(3);
    });
});
