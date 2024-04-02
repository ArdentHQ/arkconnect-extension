import { describe, expect, it } from 'vitest';
import { convertHexToRGBA } from './convertHexToRgba';

describe('convertHexToRgba', () => {
    it('should convert hex to RGBA with opacity 1', () => {
        const hex = '#FF0000';
        const opacity = '1';
        const expected = 'rgba(255, 0, 0, 1)';
        expect(convertHexToRGBA(hex, opacity)).toEqual(expected);
      });
    
      it('should convert hex to RGBA with opacity 0.5', () => {
        const hex = '#00FF00';
        const opacity = '0.5';
        const expected = 'rgba(0, 255, 0, 0.5)';
        
        expect(convertHexToRGBA(hex, opacity)).toEqual(expected);
      });
    
      it('should convert hex to RGBA with opacity 0', () => {
        const hex = '#0000FF';
        const opacity = '0';
        const expected = 'rgba(0, 0, 255, 0)';
    
        expect(convertHexToRGBA(hex, opacity)).toEqual(expected);
      });
});