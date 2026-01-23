import { useMemo, useCallback } from 'react';

/**
 * Color conversion and harmony utilities
 */

export const hexToHSL = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
      default: h = 0;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

export const hslToHex = ({ h, s, l }) => {
  h = h / 360; s = s / 100; l = l / 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

export const generateColorHarmony = (baseColor, harmonyType) => {
  const hsl = hexToHSL(baseColor);
  const colors = [baseColor];

  switch (harmonyType) {
    case 'complementary':
      colors.push(hslToHex({ ...hsl, h: (hsl.h + 180) % 360 }));
      break;
    case 'analogous':
      colors.push(hslToHex({ ...hsl, h: (hsl.h + 30) % 360 }));
      colors.push(hslToHex({ ...hsl, h: (hsl.h + 330) % 360 }));
      break;
    case 'triadic':
      colors.push(hslToHex({ ...hsl, h: (hsl.h + 120) % 360 }));
      colors.push(hslToHex({ ...hsl, h: (hsl.h + 240) % 360 }));
      break;
    case 'splitComplementary':
      colors.push(hslToHex({ ...hsl, h: (hsl.h + 150) % 360 }));
      colors.push(hslToHex({ ...hsl, h: (hsl.h + 210) % 360 }));
      break;
    case 'tetradic':
      colors.push(hslToHex({ ...hsl, h: (hsl.h + 90) % 360 }));
      colors.push(hslToHex({ ...hsl, h: (hsl.h + 180) % 360 }));
      colors.push(hslToHex({ ...hsl, h: (hsl.h + 270) % 360 }));
      break;
    case 'monochromatic':
      colors.push(hslToHex({ ...hsl, l: Math.min(95, hsl.l + 20) }));
      colors.push(hslToHex({ ...hsl, l: Math.max(5, hsl.l - 20) }));
      colors.push(hslToHex({ ...hsl, s: Math.max(10, hsl.s - 30) }));
      break;
    default:
      break;
  }

  return colors;
};

/**
 * Hook for color harmony generation
 */
export default function useColorHarmony(baseColor, harmonyType) {
  const harmonyColors = useMemo(() => {
    if (!baseColor || !harmonyType) return [baseColor];
    return generateColorHarmony(baseColor, harmonyType);
  }, [baseColor, harmonyType]);

  const getHarmony = useCallback((color, type) => {
    return generateColorHarmony(color, type);
  }, []);

  return { harmonyColors, getHarmony, hexToHSL, hslToHex };
}
