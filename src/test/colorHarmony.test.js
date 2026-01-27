import { describe, it, expect } from 'vitest';
import { hexToHSL, hslToHex, generateColorHarmony } from '../components/hooks/useColorHarmony';

describe('Color Harmony Utilities', () => {
  describe('hexToHSL', () => {
    it('should convert red hex to HSL', () => {
      const result = hexToHSL('#FF0000');
      expect(result.h).toBe(0);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    it('should convert white hex to HSL', () => {
      const result = hexToHSL('#FFFFFF');
      expect(result.h).toBe(0);
      expect(result.s).toBe(0);
      expect(result.l).toBe(100);
    });

    it('should convert black hex to HSL', () => {
      const result = hexToHSL('#000000');
      expect(result.h).toBe(0);
      expect(result.s).toBe(0);
      expect(result.l).toBe(0);
    });
  });

  describe('hslToHex', () => {
    it('should convert red HSL to hex', () => {
      const result = hslToHex({ h: 0, s: 100, l: 50 });
      expect(result).toBe('#FF0000');
    });

    it('should convert white HSL to hex', () => {
      const result = hslToHex({ h: 0, s: 0, l: 100 });
      expect(result).toBe('#FFFFFF');
    });

    it('should convert black HSL to hex', () => {
      const result = hslToHex({ h: 0, s: 0, l: 0 });
      expect(result).toBe('#000000');
    });
  });

  describe('generateColorHarmony', () => {
    it('should generate complementary colors', () => {
      const colors = generateColorHarmony('#FF0000', 'complementary');
      expect(colors).toHaveLength(2);
      expect(colors[0]).toBe('#FF0000');
    });

    it('should generate triadic colors', () => {
      const colors = generateColorHarmony('#FF0000', 'triadic');
      expect(colors).toHaveLength(3);
      expect(colors[0]).toBe('#FF0000');
    });

    it('should generate analogous colors', () => {
      const colors = generateColorHarmony('#FF0000', 'analogous');
      expect(colors).toHaveLength(3);
    });

    it('should generate tetradic colors', () => {
      const colors = generateColorHarmony('#FF0000', 'tetradic');
      expect(colors).toHaveLength(4);
    });
  });
});
