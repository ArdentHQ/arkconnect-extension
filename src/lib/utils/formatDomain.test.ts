import { it, describe, expect } from 'vitest';
import formatDomain from './formatDomain';

describe('formatDomain', () => {
  it('removes http and trailing slashes, no truncation', () => {
    expect(formatDomain('http://example.com/', false)).toBe('example.com');
  });

  it('removes https and trailing slashes, no truncation', () => {
    expect(formatDomain('https://example.com/', false)).toBe('example.com');
  });

  it('truncates long domains', () => {
    expect(formatDomain('https://verylongdomainname.com', true)).toBe('verylongdomainna...');
  });

  it('does not truncate short domains', () => {
    expect(formatDomain('example.com', true)).toBe('example.com');
  });

  it('returns undefined for undefined input', () => {
    expect(formatDomain(undefined, true)).toBeUndefined();
  });

  it('handles empty string', () => {
    expect(formatDomain('', true)).toBe('');
  });
});
