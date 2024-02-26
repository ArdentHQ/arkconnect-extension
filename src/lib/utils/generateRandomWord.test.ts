import { it, describe, expect } from 'vitest';
import { generateRandomWord } from './generateRandomWord';

describe('generateRandomWord', () => {
  it('generates a word of specified length', () => {
    const length = 10;
    const word = generateRandomWord(length);
    expect(word).toHaveLength(length);
  });

  it('generates a random word', () => {
    const length = 5;
    const word1 = generateRandomWord(length);
    const word2 = generateRandomWord(length);
    expect(word1).not.toBe(word2);
  });

  it('handles zero length', () => {
    expect(generateRandomWord(0)).toBe('');
  });

  it('handles large length', () => {
    const length = 100;
    const word = generateRandomWord(length);
    expect(word).toHaveLength(length);
  });
});
