import React, { useState, useRef, useEffect, useCallback } from 'react';

// ============ CONSTANTS ============

const colorPalettes = {
  soft: ['#FFB5BA', '#FFDAB3', '#FFF4B5', '#B5EAAA', '#B5D8EB', '#D4B5EB', '#F5CAE0', '#C9E4CA', '#F0E6EF', '#E6F0EF'],
  nature: ['#8FBC8F', '#DEB887', '#87CEEB', '#F0E68C', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#82E0AA', '#F8C471'],
  ocean: ['#5DADE2', '#48C9B0', '#76D7C4', '#85C1E9', '#A3E4D7', '#D4E6F1', '#AED6F1', '#A9CCE3', '#D6EAF8', '#E8F8F5'],
  bold: ['#E74C3C', '#F39C12', '#27AE60', '#3498DB', '#9B59B6', '#1ABC9C', '#E91E63', '#FF5722', '#00BCD4', '#8BC34A'],
  pastel: ['#E8D5E0', '#D5E8E0', '#E8E5D5', '#D5DEE8', '#E8D5D5', '#D5E8E8', '#E0D5E8', '#E8E0D5', '#D5E0E8', '#E8E0E0'],
  rainbow: ['#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#1DD1A1', '#5F27CD', '#FF6B81', '#00D2D3', '#54A0FF', '#5F27CD'],
  neon: ['#FF00FF', '#00FFFF', '#FF00AA', '#AAFF00', '#00FF00', '#FF6600', '#0066FF', '#FF0066', '#66FF00', '#00FF66'],
  vintage: ['#D4A574', '#C19A6B', '#A0522D', '#8B4513', '#CD853F', '#DEB887', '#F5DEB3', '#FAEBD7', '#FFE4C4', '#FFDAB9'],
};

const backgroundColors = [
  '#FFFFFF', '#FFF8E7', '#E8F5E9', '#E3F2FD', '#FCE4EC', '#F3E5F5',
  '#FFFDE7', '#E0F7FA', '#FBE9E7', '#F5F5F5', '#1a1a2e', '#16213e',
  '#0f0f0f', '#2d2d44', '#1e3a5f', '#0a1929'
];

// Brush types with visual characteristics
const brushTypes = [
  { id: 'pen', name: 'Pen', icon: '✒️', opacity: 1, softness: 0, minSize: 0.5, maxSize: 1 },
  { id: 'pencil', name: 'Pencil', icon: '✏️', opacity: 0.85, softness: 0.1, minSize: 0.3, maxSize: 1.2 },
  { id: 'marker', name: 'Marker', icon: '🖊️', opacity: 0.75, softness: 0, minSize: 0.8, maxSize: 1 },
  { id: 'watercolor', name: 'Watercolor', icon: '🎨', opacity: 0.35, softness: 0.8, minSize: 0.6, maxSize: 1.5 },
  { id: 'crayon', name: 'Crayon', icon: '🖍️', opacity: 0.9, softness: 0.2, minSize: 0.7, maxSize: 1.1 },
  { id: 'airbrush', name: 'Airbrush', icon: '💨', opacity: 0.25, softness: 1, minSize: 1, maxSize: 2 },
  { id: 'calligraphy', name: 'Calligraphy', icon: '🖋️', opacity: 1, softness: 0, minSize: 0.2, maxSize: 2.5 },
  { id: 'highlighter', name: 'Highlighter', icon: '🔆', opacity: 0.35, softness: 0, minSize: 1.5, maxSize: 1.5 },
  { id: 'spray', name: 'Spray', icon: '🎨', opacity: 0.15, softness: 1.5, minSize: 2, maxSize: 3 },
];

// Shape tools
const shapeTools = [
  { id: 'rectangle', name: 'Rectangle', icon: '⬜' },
  { id: 'ellipse', name: 'Ellipse', icon: '⭕' },
  { id: 'line', name: 'Line', icon: '➖' },
  { id: 'triangle', name: 'Triangle', icon: '△' },
  { id: 'star', name: 'Star', icon: '⭐' },
  { id: 'arrow', name: 'Arrow', icon: '➡️' },
  { id: 'hexagon', name: 'Hexagon', icon: '⬡' },
  { id: 'heart', name: 'Heart', icon: '♥️' },
];

// Symmetry modes
const symmetryModes = [
  { id: 'none', name: 'Off', icon: '⊘', lines: 0 },
  { id: 'horizontal', name: 'Horizontal', icon: '↔️', lines: 1 },
  { id: 'vertical', name: 'Vertical', icon: '↕️', lines: 1 },
  { id: 'quad', name: 'Quad', icon: '✚', lines: 2 },
  { id: 'radial4', name: '4-Way', icon: '✦', spokes: 4 },
  { id: 'radial6', name: '6-Way', icon: '✶', spokes: 6 },
  { id: 'radial8', name: '8-Way', icon: '❋', spokes: 8 },
  { id: 'radial12', name: '12-Way', icon: '✺', spokes: 12 },
];

const musicTracks = [
  { name: 'Gentle Dreams', emoji: '🌙', type: 'lullaby' },
  { name: 'Happy Meadow', emoji: '🌻', type: 'cheerful' },
  { name: 'Ocean Waves', emoji: '🌊', type: 'calm' },
  { name: 'Twinkle Stars', emoji: '✨', type: 'playful' },
  { name: 'Rainy Day', emoji: '🌧️', type: 'peaceful' },
  { name: 'Forest Birds', emoji: '🐦', type: 'nature' },
];

// Ambient soundscapes for relaxation
const ambientSounds = [
  { id: 'rain', name: 'Rain', emoji: '🌧️', category: 'nature' },
  { id: 'thunder', name: 'Thunderstorm', emoji: '⛈️', category: 'nature' },
  { id: 'ocean', name: 'Ocean Waves', emoji: '🌊', category: 'nature' },
  { id: 'forest', name: 'Forest', emoji: '🌲', category: 'nature' },
  { id: 'birds', name: 'Birds', emoji: '🐦', category: 'nature' },
  { id: 'wind', name: 'Wind', emoji: '💨', category: 'nature' },
  { id: 'fire', name: 'Fireplace', emoji: '🔥', category: 'cozy' },
  { id: 'cafe', name: 'Coffee Shop', emoji: '☕', category: 'ambient' },
  { id: 'white', name: 'White Noise', emoji: '📻', category: 'focus' },
  { id: 'brown', name: 'Brown Noise', emoji: '🟤', category: 'focus' },
  { id: 'creek', name: 'Creek', emoji: '🏞️', category: 'nature' },
  { id: 'night', name: 'Night Crickets', emoji: '🦗', category: 'nature' },
];

// Color harmony types
const colorHarmonyTypes = [
  { id: 'complementary', name: 'Complementary', description: 'Opposite colors' },
  { id: 'analogous', name: 'Analogous', description: 'Adjacent colors' },
  { id: 'triadic', name: 'Triadic', description: '3 evenly spaced' },
  { id: 'splitComplementary', name: 'Split Comp.', description: 'Base + adjacent to complement' },
  { id: 'tetradic', name: 'Tetradic', description: '4 evenly spaced' },
  { id: 'monochromatic', name: 'Monochromatic', description: 'Same hue variations' },
];

// Breathing patterns for relaxation
const breathingPatterns = [
  { id: 'box', name: 'Box Breathing', inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  { id: '478', name: '4-7-8 Relaxing', inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  { id: 'calm', name: 'Calming', inhale: 4, hold1: 2, exhale: 6, hold2: 2 },
  { id: 'energize', name: 'Energizing', inhale: 4, hold1: 0, exhale: 4, hold2: 0 },
];

const drawings = [
  {
    name: 'Bunny', icon: '🐰',
    paths: [
      { id: 'body', d: 'M150 200 Q150 140 180 120 Q210 100 240 120 Q270 140 270 200 Q270 280 210 300 Q150 280 150 200' },
      { id: 'head', d: 'M170 130 Q170 80 210 60 Q250 80 250 130 Q250 160 210 170 Q170 160 170 130' },
      { id: 'ear-left', d: 'M175 70 Q160 20 170 -20 Q190 -10 195 40 Q195 60 185 70' },
      { id: 'ear-right', d: 'M245 70 Q260 20 250 -20 Q230 -10 225 40 Q225 60 235 70' },
      { id: 'tail', d: 'M265 240 Q290 230 295 250 Q290 270 265 260' },
      { id: 'nose', d: 'M200 120 Q210 115 220 120 Q215 130 210 130 Q205 130 200 120' },
    ]
  },
  {
    name: 'Flower', icon: '🌸',
    paths: [
      { id: 'petal1', d: 'M210 100 Q240 60 210 20 Q180 60 210 100' },
      { id: 'petal2', d: 'M210 100 Q270 100 290 70 Q260 40 210 100' },
      { id: 'petal3', d: 'M210 100 Q270 140 290 180 Q240 160 210 100' },
      { id: 'petal4', d: 'M210 100 Q180 160 150 180 Q150 140 210 100' },
      { id: 'petal5', d: 'M210 100 Q150 100 130 70 Q160 40 210 100' },
      { id: 'center', d: 'M210 100 m-25 0 a25 25 0 1 0 50 0 a25 25 0 1 0 -50 0' },
      { id: 'stem', d: 'M200 125 Q200 200 195 280 Q205 285 215 280 Q220 200 220 125' },
      { id: 'leaf', d: 'M200 200 Q150 180 130 200 Q150 220 200 210' },
    ]
  },
  {
    name: 'Star', icon: '⭐',
    paths: [
      { id: 'star-outer', d: 'M210 20 L240 90 L320 100 L260 150 L280 230 L210 190 L140 230 L160 150 L100 100 L180 90 Z' },
      { id: 'star-inner', d: 'M210 60 L225 100 L270 105 L240 130 L250 175 L210 155 L170 175 L180 130 L150 105 L195 100 Z' },
    ]
  },
  {
    name: 'Fish', icon: '🐠',
    paths: [
      { id: 'body', d: 'M80 150 Q120 80 200 80 Q300 80 340 150 Q300 220 200 220 Q120 220 80 150' },
      { id: 'tail', d: 'M70 150 Q30 100 50 60 Q60 100 80 150 Q60 200 50 240 Q30 200 70 150' },
      { id: 'fin-top', d: 'M180 85 Q200 40 220 85' },
      { id: 'fin-bottom', d: 'M180 215 Q200 260 220 215' },
      { id: 'eye', d: 'M280 130 m-15 0 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0' },
      { id: 'stripe1', d: 'M150 100 Q160 150 150 200 Q170 150 150 100' },
      { id: 'stripe2', d: 'M200 90 Q210 150 200 210 Q220 150 200 90' },
    ]
  },
  {
    name: 'Butterfly', icon: '🦋',
    paths: [
      { id: 'wing-tl', d: 'M200 150 Q150 100 100 80 Q80 120 100 160 Q140 180 200 150' },
      { id: 'wing-tr', d: 'M220 150 Q270 100 320 80 Q340 120 320 160 Q280 180 220 150' },
      { id: 'wing-bl', d: 'M200 170 Q150 200 120 240 Q150 260 180 240 Q200 210 200 170' },
      { id: 'wing-br', d: 'M220 170 Q270 200 300 240 Q270 260 240 240 Q220 210 220 170' },
      { id: 'body', d: 'M200 100 Q205 100 210 100 Q215 150 215 200 Q215 250 210 280 Q205 280 200 280 Q195 250 195 200 Q195 150 200 100' },
      { id: 'spot1', d: 'M140 120 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0' },
      { id: 'spot2', d: 'M280 120 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0' },
    ]
  },
  {
    name: 'House', icon: '🏠',
    paths: [
      { id: 'roof', d: 'M100 140 L210 50 L320 140 Z' },
      { id: 'walls', d: 'M120 140 L120 280 L300 280 L300 140 Z' },
      { id: 'door', d: 'M180 280 L180 200 L240 200 L240 280 Z' },
      { id: 'window1', d: 'M140 160 L140 190 L170 190 L170 160 Z' },
      { id: 'window2', d: 'M250 160 L250 190 L280 190 L280 160 Z' },
      { id: 'chimney', d: 'M260 50 L260 100 L290 100 L290 70 Z' },
    ]
  },
  {
    name: 'Cat', icon: '🐱',
    paths: [
      { id: 'body', d: 'M120 180 Q100 220 120 280 Q180 320 260 280 Q280 220 260 180 Q220 140 180 140 Q140 140 120 180' },
      { id: 'head', d: 'M150 140 Q150 80 210 70 Q270 80 270 140 Q270 180 210 190 Q150 180 150 140' },
      { id: 'ear-left', d: 'M155 100 L140 50 L180 80 Z' },
      { id: 'ear-right', d: 'M265 100 L280 50 L240 80 Z' },
      { id: 'tail', d: 'M260 250 Q320 240 340 200 Q350 180 340 170' },
      { id: 'nose', d: 'M200 130 Q210 125 220 130 Q210 140 200 130' },
    ]
  },
  {
    name: 'Heart', icon: '❤️',
    paths: [
      { id: 'heart', d: 'M210 280 Q100 200 100 120 Q100 60 160 60 Q210 60 210 120 Q210 60 260 60 Q320 60 320 120 Q320 200 210 280' },
      { id: 'shine1', d: 'M140 100 Q150 80 160 100 Q150 90 140 100' },
      { id: 'shine2', d: 'M130 130 Q135 120 140 130' },
    ]
  },
  { name: 'Free Draw', icon: '✏️', paths: [] },
];

// ============ MUSIC HOOK ============

const useMusic = () => {
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const intervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  const melodies = {
    lullaby: [261.63, 293.66, 329.63, 293.66, 261.63, 293.66, 329.63, 349.23, 329.63, 293.66, 261.63],
    cheerful: [392, 440, 494, 523, 494, 440, 392, 440, 494, 523, 587, 523],
    calm: [196, 220, 247, 262, 247, 220, 196, 220, 247, 262],
    playful: [523, 587, 659, 698, 659, 587, 523, 587, 659, 784, 659, 587],
    peaceful: [220, 262, 294, 330, 294, 262, 220, 262, 294, 330],
    nature: [440, 494, 523, 587, 659, 587, 523, 494, 440, 523, 587, 659],
  };

  const playTrack = useCallback((track) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (oscillatorRef.current) try { oscillatorRef.current.stop(); } catch(e) {}
    if (audioContextRef.current) try { audioContextRef.current.close(); } catch(e) {}

    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);
    gainNodeRef.current.gain.value = 0.12;

    const melody = melodies[track.type];
    let noteIndex = 0;

    const playNote = () => {
      if (oscillatorRef.current) try { oscillatorRef.current.stop(); } catch(e) {}
      oscillatorRef.current = audioContextRef.current.createOscillator();
      oscillatorRef.current.type = 'sine';
      oscillatorRef.current.frequency.value = melody[noteIndex % melody.length];
      oscillatorRef.current.connect(gainNodeRef.current);
      oscillatorRef.current.start();
      oscillatorRef.current.stop(audioContextRef.current.currentTime + 0.35);
      noteIndex++;
    };

    playNote();
    intervalRef.current = setInterval(playNote, 450);
    setIsPlaying(true);
    setCurrentTrack(track);
  }, []);

  const stopMusic = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (oscillatorRef.current) try { oscillatorRef.current.stop(); } catch(e) {}
    if (audioContextRef.current) try { audioContextRef.current.close(); } catch(e) {}
    setIsPlaying(false);
    setCurrentTrack(null);
  }, []);

  return { isPlaying, currentTrack, playTrack, stopMusic };
};

// ============ COLOR HARMONY UTILITIES ============

const hexToHSL = (hex) => {
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

const hslToHex = ({ h, s, l }) => {
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

const generateColorHarmony = (baseColor, harmonyType) => {
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

// ============ SMOOTH PATH UTILITY ============

const smoothPath = (points, stabilization = 0) => {
  if (points.length < 3) {
    if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    return '';
  }

  // Apply stabilization by averaging nearby points
  let processedPoints = points;
  if (stabilization > 0) {
    const windowSize = Math.min(Math.floor(stabilization * 5) + 1, points.length);
    processedPoints = points.map((point, i) => {
      const start = Math.max(0, i - windowSize);
      const end = Math.min(points.length, i + windowSize + 1);
      const window = points.slice(start, end);
      return {
        x: window.reduce((sum, p) => sum + p.x, 0) / window.length,
        y: window.reduce((sum, p) => sum + p.y, 0) / window.length,
        pressure: point.pressure
      };
    });
  }

  let d = `M ${processedPoints[0].x} ${processedPoints[0].y}`;

  for (let i = 1; i < processedPoints.length - 1; i++) {
    const p0 = processedPoints[i - 1];
    const p1 = processedPoints[i];
    const p2 = processedPoints[i + 1];

    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    d += ` Q ${p1.x} ${p1.y} ${midX} ${midY}`;
  }

  const last = processedPoints[processedPoints.length - 1];
  d += ` L ${last.x} ${last.y}`;

  return d;
};

// Format time as HH:MM:SS
const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// ============ MAIN COMPONENT ============

export default function ColoringGame() {
  // Core state
  const [currentDrawing, setCurrentDrawing] = useState(0);
  const [currentPalette, setCurrentPalette] = useState('soft');
  const [selectedColor, setSelectedColor] = useState(colorPalettes.soft[0]);
  const [colorOpacity, setColorOpacity] = useState(1);
  const [filledColors, setFilledColors] = useState({});
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showCelebration, setShowCelebration] = useState(false);

  // Tool state
  const [activeTool, setActiveTool] = useState('brush');
  const [brushType, setBrushType] = useState(brushTypes[0]);
  const [brushSize, setBrushSize] = useState(12);
  const [shapeType, setShapeType] = useState(shapeTools[0]);
  const [shapeFill, setShapeFill] = useState(true);
  const [symmetryMode, setSymmetryMode] = useState(symmetryModes[0]);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [currentPath, setCurrentPath] = useState(null);
  const [currentShape, setCurrentShape] = useState(null);
  const lastPointRef = useRef(null);
  const lastTimeRef = useRef(0);

  // Layers system
  const [layers, setLayers] = useState([
    { id: 'layer-1', name: 'Layer 1', visible: true, locked: false, opacity: 1, paths: [] }
  ]);
  const [activeLayerId, setActiveLayerId] = useState('layer-1');
  const [draggedLayerId, setDraggedLayerId] = useState(null);

  // UI state
  const [activePanel, setActivePanel] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showMobileTools, setShowMobileTools] = useState(false);
  const [recentColors, setRecentColors] = useState([]);
  const [hexInput, setHexInput] = useState('#FFB5BA');

  // Focus Mode (distraction-free drawing)
  const [focusMode, setFocusMode] = useState(false);
  const [focusHoverZone, setFocusHoverZone] = useState(null);

  // Session Timer
  const [sessionStartTime] = useState(Date.now());
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const [breakInterval, setBreakInterval] = useState(25); // minutes
  const [breakReminderEnabled, setBreakReminderEnabled] = useState(true);
  const [lastBreakTime, setLastBreakTime] = useState(Date.now());

  // Brush Stabilization
  const [brushStabilization, setBrushStabilization] = useState(0); // 0-4 levels

  // Color Harmony
  const [showColorHarmony, setShowColorHarmony] = useState(false);
  const [selectedHarmony, setSelectedHarmony] = useState('complementary');
  const [harmonyColors, setHarmonyColors] = useState([]);

  // Breathing Exercise
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingPattern, setBreathingPattern] = useState(breathingPatterns[0]);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingProgress, setBreathingProgress] = useState(0);

  // Ambient Sound Mixer
  const [activeSounds, setActiveSounds] = useState({});
  const [masterVolume, setMasterVolume] = useState(0.7);

  // History (undo/redo)
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistory = 50;

  // Export
  const [isSaving, setIsSaving] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('png');
  const [exportQuality, setExportQuality] = useState(2);

  // Window size
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const isMobile = windowSize.width < 768;

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { isPlaying, currentTrack, playTrack, stopMusic } = useMusic();

  // ============ EFFECTS ============

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  // Break reminder
  useEffect(() => {
    if (!breakReminderEnabled) return;
    const checkBreak = setInterval(() => {
      const minutesSinceBreak = (Date.now() - lastBreakTime) / 60000;
      if (minutesSinceBreak >= breakInterval && !showBreakReminder) {
        setShowBreakReminder(true);
      }
    }, 30000); // Check every 30 seconds
    return () => clearInterval(checkBreak);
  }, [breakInterval, lastBreakTime, breakReminderEnabled, showBreakReminder]);

  // Update color harmony when color changes
  useEffect(() => {
    if (showColorHarmony) {
      setHarmonyColors(generateColorHarmony(selectedColor, selectedHarmony));
    }
  }, [selectedColor, selectedHarmony, showColorHarmony]);

  // Breathing exercise animation
  useEffect(() => {
    if (!showBreathing) return;

    const pattern = breathingPattern;
    const phases = [
      { name: 'inhale', duration: pattern.inhale },
      { name: 'hold1', duration: pattern.hold1 },
      { name: 'exhale', duration: pattern.exhale },
      { name: 'hold2', duration: pattern.hold2 },
    ].filter(p => p.duration > 0);

    let phaseIndex = 0;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 0.1;
      const currentPhase = phases[phaseIndex];
      const progress = elapsed / currentPhase.duration;

      if (progress >= 1) {
        phaseIndex = (phaseIndex + 1) % phases.length;
        elapsed = 0;
        setBreathingPhase(phases[phaseIndex].name);
        setBreathingProgress(0);
      } else {
        setBreathingProgress(progress);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [showBreathing, breathingPattern]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.matches('input, textarea')) return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      if (ctrlKey && ['z', 'y', 's', 'e', 'a'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      switch (e.key.toLowerCase()) {
        case 'v': setActiveTool('select'); break;
        case 'b': setActiveTool('brush'); break;
        case 'e': if (!ctrlKey) setActiveTool('eraser'); break;
        case 'g': setActiveTool('fill'); break;
        case 'u': setActiveTool('shape'); break;
        case '[': setBrushSize(s => Math.max(1, s - 4)); break;
        case ']': setBrushSize(s => Math.min(100, s + 4)); break;
        case 'm': setSymmetryMode(prev => {
          const idx = symmetryModes.findIndex(s => s.id === prev.id);
          return symmetryModes[(idx + 1) % symmetryModes.length];
        }); break;
        case ' ':
          if (!isDrawing) {
            e.preventDefault();
            setIsPanning(true);
          }
          break;
        case 'escape':
          if (focusMode) {
            setFocusMode(false);
          } else {
            setActivePanel(null);
          }
          break;
        case 'f11':
          e.preventDefault();
          setFocusMode(f => !f);
          break;
      }

      // F key for focus mode
      if (e.key === 'f' && !ctrlKey && !e.shiftKey) {
        setFocusMode(f => !f);
      }

      if (ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'z': e.shiftKey ? redo() : undo(); break;
          case 'y': redo(); break;
          case 's': saveArtwork(); break;
          case 'e': setShowExportModal(true); break;
          case '0': e.preventDefault(); setZoom(1); setPan({ x: 0, y: 0 }); break;
        }
      }

      if (e.key === '=' || e.key === '+') setZoom(z => Math.min(4, z + 0.25));
      if (e.key === '-' && !ctrlKey) setZoom(z => Math.max(0.25, z - 0.25));
    };

    const handleKeyUp = (e) => {
      if (e.key === ' ') setIsPanning(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isDrawing]);

  // Wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        setZoom(z => Math.max(0.25, Math.min(4, z + delta)));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // ============ HISTORY FUNCTIONS ============

  const saveToHistory = useCallback(() => {
    const state = {
      layers: JSON.parse(JSON.stringify(layers)),
      filledColors: { ...filledColors },
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(state);
      if (newHistory.length > maxHistory) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, maxHistory - 1));
  }, [layers, filledColors, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setLayers(prevState.layers);
      setFilledColors(prevState.filledColors);
      setHistoryIndex(i => i - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setLayers(nextState.layers);
      setFilledColors(nextState.filledColors);
      setHistoryIndex(i => i + 1);
    }
  }, [history, historyIndex]);

  // ============ LAYER FUNCTIONS ============

  const getActiveLayer = useCallback(() => layers.find(l => l.id === activeLayerId), [layers, activeLayerId]);

  const addLayer = () => {
    const newLayer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      locked: false,
      opacity: 1,
      paths: []
    };
    setLayers([...layers, newLayer]);
    setActiveLayerId(newLayer.id);
  };

  const deleteLayer = (id) => {
    if (layers.length <= 1) return;
    const newLayers = layers.filter(l => l.id !== id);
    setLayers(newLayers);
    if (activeLayerId === id) setActiveLayerId(newLayers[0].id);
  };

  const duplicateLayer = (id) => {
    const layer = layers.find(l => l.id === id);
    if (!layer) return;
    const newLayer = {
      ...JSON.parse(JSON.stringify(layer)),
      id: `layer-${Date.now()}`,
      name: `${layer.name} copy`
    };
    const idx = layers.findIndex(l => l.id === id);
    const newLayers = [...layers];
    newLayers.splice(idx + 1, 0, newLayer);
    setLayers(newLayers);
  };

  const toggleLayerVisibility = (id) => setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  const toggleLayerLock = (id) => setLayers(layers.map(l => l.id === id ? { ...l, locked: !l.locked } : l));
  const setLayerOpacity = (id, opacity) => setLayers(layers.map(l => l.id === id ? { ...l, opacity } : l));

  const handleLayerDragStart = (id) => setDraggedLayerId(id);
  const handleLayerDragOver = (e) => e.preventDefault();
  const handleLayerDrop = (targetId) => {
    if (!draggedLayerId || draggedLayerId === targetId) return;
    const fromIdx = layers.findIndex(l => l.id === draggedLayerId);
    const toIdx = layers.findIndex(l => l.id === targetId);
    const newLayers = [...layers];
    const [moved] = newLayers.splice(fromIdx, 1);
    newLayers.splice(toIdx, 0, moved);
    setLayers(newLayers);
    setDraggedLayerId(null);
  };

  // ============ DRAWING FUNCTIONS ============

  const getPointerPosition = useCallback((e) => {
    const svg = canvasRef.current;
    if (!svg) return { x: 0, y: 0 };

    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let x = ((clientX - rect.left) / rect.width) * 420;
    let y = ((clientY - rect.top) / rect.height) * 300;

    if (snapToGrid) {
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }

    return { x, y };
  }, [snapToGrid, gridSize]);

  const generateSymmetricPoints = useCallback((point, mode) => {
    const points = [point];
    const cx = 210, cy = 150;

    if (mode.id === 'horizontal') {
      points.push({ x: 2 * cx - point.x, y: point.y });
    } else if (mode.id === 'vertical') {
      points.push({ x: point.x, y: 2 * cy - point.y });
    } else if (mode.id === 'quad') {
      points.push({ x: 2 * cx - point.x, y: point.y });
      points.push({ x: point.x, y: 2 * cy - point.y });
      points.push({ x: 2 * cx - point.x, y: 2 * cy - point.y });
    } else if (mode.spokes) {
      for (let i = 1; i < mode.spokes; i++) {
        const angle = (2 * Math.PI * i) / mode.spokes;
        const dx = point.x - cx;
        const dy = point.y - cy;
        points.push({
          x: cx + dx * Math.cos(angle) - dy * Math.sin(angle),
          y: cy + dx * Math.sin(angle) + dy * Math.cos(angle)
        });
      }
    }

    return points;
  }, []);

  const handlePointerDown = useCallback((e) => {
    if (isPanning) return;

    const pos = getPointerPosition(e);
    const layer = getActiveLayer();

    if (layer?.locked && activeTool !== 'fill') return;

    if (activeTool === 'brush' || activeTool === 'eraser') {
      e.preventDefault();
      saveToHistory();
      setIsDrawing(true);
      lastPointRef.current = pos;
      lastTimeRef.current = Date.now();

      const initialPaths = generateSymmetricPoints(pos, symmetryMode).map((p, i) => ({
        id: `path-${Date.now()}-${i}`,
        color: activeTool === 'eraser' ? backgroundColor : selectedColor,
        size: brushSize,
        brushType,
        opacity: activeTool === 'eraser' ? 1 : brushType.opacity * colorOpacity,
        points: [p],
        isEraser: activeTool === 'eraser',
        stabilization: brushStabilization
      }));

      setCurrentPath(initialPaths);
    } else if (activeTool === 'shape') {
      e.preventDefault();
      saveToHistory();
      setIsDrawing(true);
      setCurrentShape({
        id: `shape-${Date.now()}`,
        type: shapeType.id,
        startX: pos.x, startY: pos.y,
        endX: pos.x, endY: pos.y,
        color: selectedColor,
        fill: shapeFill,
        strokeWidth: Math.max(2, brushSize / 4),
        opacity: colorOpacity
      });
    }
  }, [isPanning, getPointerPosition, getActiveLayer, activeTool, saveToHistory, generateSymmetricPoints, symmetryMode, backgroundColor, selectedColor, brushSize, brushType, colorOpacity, shapeType, shapeFill]);

  const handlePointerMove = useCallback((e) => {
    if (isPanning && e.buttons === 1) {
      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;
      setPan(p => ({ x: p.x + movementX / zoom, y: p.y + movementY / zoom }));
      return;
    }

    if (!isDrawing) return;

    const pos = getPointerPosition(e);

    if ((activeTool === 'brush' || activeTool === 'eraser') && currentPath) {
      e.preventDefault();

      // Calculate speed-based size variation
      const now = Date.now();
      const timeDelta = now - lastTimeRef.current;
      const lastPos = lastPointRef.current;

      if (lastPos && timeDelta > 0) {
        const distance = Math.sqrt(Math.pow(pos.x - lastPos.x, 2) + Math.pow(pos.y - lastPos.y, 2));
        const speed = distance / timeDelta;

        // Vary size based on speed (faster = thinner for calligraphy effect)
        const speedFactor = Math.max(brushType.minSize, Math.min(brushType.maxSize, 1 - speed * 0.5));

        const symmetricPoints = generateSymmetricPoints(pos, symmetryMode);

        setCurrentPath(prev => prev.map((path, i) => ({
          ...path,
          points: [...path.points, { ...symmetricPoints[i], pressure: speedFactor }]
        })));
      }

      lastPointRef.current = pos;
      lastTimeRef.current = now;
    } else if (activeTool === 'shape' && currentShape) {
      e.preventDefault();
      let { x: endX, y: endY } = pos;

      if (e.shiftKey) {
        const dx = Math.abs(endX - currentShape.startX);
        const dy = Math.abs(endY - currentShape.startY);
        const size = Math.max(dx, dy);
        endX = currentShape.startX + (endX > currentShape.startX ? size : -size);
        endY = currentShape.startY + (endY > currentShape.startY ? size : -size);
      }

      setCurrentShape(prev => ({ ...prev, endX, endY }));
    }
  }, [isPanning, zoom, isDrawing, getPointerPosition, activeTool, currentPath, currentShape, brushType, generateSymmetricPoints, symmetryMode]);

  const handlePointerUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if ((activeTool === 'brush' || activeTool === 'eraser') && currentPath) {
      const validPaths = currentPath.filter(p => p.points.length > 1);
      if (validPaths.length > 0) {
        setLayers(prev => prev.map(l =>
          l.id === activeLayerId ? { ...l, paths: [...l.paths, ...validPaths] } : l
        ));
      }
      setCurrentPath(null);

      if (activeTool === 'brush' && !recentColors.includes(selectedColor)) {
        setRecentColors(prev => [selectedColor, ...prev.slice(0, 9)]);
      }
    } else if (activeTool === 'shape' && currentShape) {
      if (Math.abs(currentShape.endX - currentShape.startX) > 5 || Math.abs(currentShape.endY - currentShape.startY) > 5) {
        setLayers(prev => prev.map(l =>
          l.id === activeLayerId ? { ...l, paths: [...l.paths, { ...currentShape, isShape: true }] } : l
        ));
      }
      setCurrentShape(null);
    }
  }, [isDrawing, activeTool, currentPath, currentShape, activeLayerId, recentColors, selectedColor]);

  const handlePathClick = (pathId) => {
    if (activeTool !== 'fill') return;
    saveToHistory();

    const key = `${currentDrawing}-${pathId}`;
    setFilledColors(prev => ({ ...prev, [key]: selectedColor }));

    const drawing = drawings[currentDrawing];
    if (drawing.paths.length > 0) {
      const newFilled = { ...filledColors, [key]: selectedColor };
      if (drawing.paths.every(p => newFilled[`${currentDrawing}-${p.id}`])) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2500);
      }
    }
  };

  const clearDrawing = () => {
    saveToHistory();
    setFilledColors(prev => {
      const newColors = { ...prev };
      Object.keys(newColors).filter(k => k.startsWith(`${currentDrawing}-`)).forEach(k => delete newColors[k]);
      return newColors;
    });
    setLayers(prev => prev.map(l => ({ ...l, paths: [] })));
  };

  // ============ SHAPE PATH GENERATION ============

  const shapeToPath = (shape) => {
    const { type, startX, startY, endX, endY } = shape;
    const w = endX - startX, h = endY - startY;
    const cx = startX + w / 2, cy = startY + h / 2;
    const r = Math.min(Math.abs(w), Math.abs(h)) / 2;

    switch (type) {
      case 'rectangle':
        return `M ${startX} ${startY} L ${endX} ${startY} L ${endX} ${endY} L ${startX} ${endY} Z`;
      case 'ellipse':
        const rx = Math.abs(w) / 2, ry = Math.abs(h) / 2;
        return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
      case 'line':
        return `M ${startX} ${startY} L ${endX} ${endY}`;
      case 'triangle':
        return `M ${cx} ${startY} L ${endX} ${endY} L ${startX} ${endY} Z`;
      case 'star':
        const pts = [];
        for (let i = 0; i < 10; i++) {
          const pr = i % 2 === 0 ? r : r * 0.4;
          const angle = (Math.PI * i) / 5 - Math.PI / 2;
          pts.push({ x: cx + pr * Math.cos(angle), y: cy + pr * Math.sin(angle) });
        }
        return `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') + ' Z';
      case 'arrow':
        const aw = Math.abs(w) * 0.25;
        return `M ${startX} ${cy - aw} L ${endX - w*0.35} ${cy - aw} L ${endX - w*0.35} ${startY} L ${endX} ${cy} L ${endX - w*0.35} ${endY} L ${endX - w*0.35} ${cy + aw} L ${startX} ${cy + aw} Z`;
      case 'hexagon':
        const hexPts = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI * i) / 3 - Math.PI / 2;
          hexPts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
        }
        return `M ${hexPts[0].x} ${hexPts[0].y} ` + hexPts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') + ' Z';
      case 'heart':
        return `M ${cx} ${endY} C ${startX - w*0.1} ${cy + h*0.2} ${startX} ${cy - h*0.1} ${startX + w*0.25} ${startY + h*0.25} C ${cx - w*0.1} ${startY} ${cx} ${startY + h*0.15} ${cx} ${startY + h*0.35} C ${cx} ${startY + h*0.15} ${cx + w*0.1} ${startY} ${endX - w*0.25} ${startY + h*0.25} C ${endX} ${cy - h*0.1} ${endX + w*0.1} ${cy + h*0.2} ${cx} ${endY}`;
      default:
        return '';
    }
  };

  // ============ EXPORT ============

  const saveArtwork = async (format = exportFormat, quality = exportQuality) => {
    if (!canvasRef.current || isSaving) return;
    setIsSaving(true);

    try {
      const svg = canvasRef.current;
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });

      if (format === 'svg') {
        const url = URL.createObjectURL(svgBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `artwork-${drawings[currentDrawing].name.toLowerCase().replace(' ', '-')}-${Date.now()}.svg`;
        a.click();
        URL.revokeObjectURL(url);
        setIsSaving(false);
        setShowExportModal(false);
        return;
      }

      const svgUrl = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const scale = quality;
        const canvas = document.createElement('canvas');
        canvas.width = 420 * scale;
        canvas.height = 300 * scale;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `artwork-${drawings[currentDrawing].name.toLowerCase().replace(' ', '-')}-${Date.now()}.${format}`;
          a.click();
          URL.revokeObjectURL(url);
          URL.revokeObjectURL(svgUrl);
          setIsSaving(false);
          setShowExportModal(false);
        }, format === 'jpg' ? 'image/jpeg' : 'image/png', 0.95);
      };
      img.src = svgUrl;
    } catch (e) {
      setIsSaving(false);
    }
  };

  // ============ COLOR FUNCTIONS ============

  const handleHexChange = (hex) => {
    setHexInput(hex);
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) setSelectedColor(hex);
  };

  // ============ RENDER ============

  const drawing = drawings[currentDrawing];
  const canvasWidth = isMobile ? windowSize.width - 16 : Math.min(windowSize.width - 380, 900);
  const canvasHeight = canvasWidth * (300 / 420);

  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50',
    panel: darkMode ? 'bg-gray-800' : 'bg-white',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500',
    hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    active: 'bg-purple-500 text-white',
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden select-none ${theme.bg} ${theme.text}`}>
      {/* Focus Mode Floating Toolbar */}
      {focusMode && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${theme.panel} rounded-full shadow-lg px-4 py-2 flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity`}
        >
          <span className="text-sm font-medium">Focus Mode</span>
          <div className={`w-px h-4 ${theme.border}`} />
          {[
            { id: 'brush', icon: '🖌️' },
            { id: 'eraser', icon: '🧽' },
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`p-1 rounded ${activeTool === tool.id ? 'bg-purple-500 text-white' : theme.hover}`}
            >
              {tool.icon}
            </button>
          ))}
          <div className={`w-px h-4 ${theme.border}`} />
          <div className="flex items-center gap-1">
            <button onClick={() => setBrushSize(s => Math.max(2, s - 4))} className={`text-sm px-1 ${theme.hover} rounded`}>−</button>
            <span className="text-xs w-6 text-center">{brushSize}</span>
            <button onClick={() => setBrushSize(s => Math.min(80, s + 4))} className={`text-sm px-1 ${theme.hover} rounded`}>+</button>
          </div>
          <div
            className="w-6 h-6 rounded-full border-2 border-white shadow cursor-pointer"
            style={{ backgroundColor: selectedColor }}
            onClick={() => setActivePanel(activePanel === 'focusColors' ? null : 'focusColors')}
          />
          <button onClick={() => setFocusMode(false)} className={`p-1 rounded ${theme.hover}`} title="Exit Focus Mode (Esc)">
            ✕
          </button>
        </div>
      )}

      {/* Focus Mode Color Picker */}
      {focusMode && activePanel === 'focusColors' && (
        <div className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50 ${theme.panel} rounded-xl shadow-lg p-3`}>
          <div className="grid grid-cols-5 gap-1">
            {colorPalettes[currentPalette].map(color => (
              <button
                key={color}
                onClick={() => { setSelectedColor(color); setHexInput(color); setActivePanel(null); }}
                className={`w-8 h-8 rounded-lg ${selectedColor === color ? 'ring-2 ring-purple-500' : ''}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Top Bar - hidden in focus mode */}
      {!focusMode && (
      <div className={`flex items-center justify-between px-2 py-1.5 ${theme.panel} shadow-sm z-20 gap-2`}>
        {/* Left: Logo + Drawing selector */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent hidden sm:block">
            Calm Drawing
          </span>

          <div className="relative">
            <button
              onClick={() => setActivePanel(activePanel === 'pictures' ? null : 'pictures')}
              className={`px-2 py-1 rounded-lg text-sm flex items-center gap-1 ${theme.hover} border ${theme.border}`}
            >
              {drawing.icon} <span className="hidden sm:inline">{drawing.name}</span>
              <span className="text-xs opacity-50">▼</span>
            </button>
            {activePanel === 'pictures' && (
              <div className={`absolute top-full left-0 mt-1 ${theme.panel} rounded-xl shadow-2xl border ${theme.border} p-2 z-50 w-64`}>
                <div className="grid grid-cols-3 gap-1">
                  {drawings.map((d, i) => (
                    <button
                      key={d.name}
                      onClick={() => { setCurrentDrawing(i); setActivePanel(null); }}
                      className={`p-2 rounded-lg text-center transition-all ${currentDrawing === i ? theme.active : theme.hover}`}
                    >
                      <div className="text-2xl">{d.icon}</div>
                      <div className="text-xs truncate">{d.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Tools (desktop) */}
        {!isMobile && (
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {[
              { id: 'brush', icon: '🖌️', label: 'Brush' },
              { id: 'eraser', icon: '🧽', label: 'Eraser' },
              { id: 'fill', icon: '🪣', label: 'Fill' },
              { id: 'shape', icon: '⬜', label: 'Shapes' },
            ].map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${activeTool === tool.id ? theme.active : theme.hover}`}
                title={tool.label}
              >
                {tool.icon}
              </button>
            ))}
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button onClick={undo} disabled={historyIndex <= 0} className={`p-1.5 rounded-lg ${historyIndex > 0 ? theme.hover : 'opacity-30'}`} title="Undo">↩️</button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1} className={`p-1.5 rounded-lg ${historyIndex < history.length - 1 ? theme.hover : 'opacity-30'}`} title="Redo">↪️</button>

          <div className={`w-px h-6 mx-1 ${theme.border}`} />

          <button onClick={() => setZoom(z => Math.max(0.25, z - 0.25))} className={`p-1 rounded ${theme.hover}`}>−</button>
          <span className="text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(4, z + 0.25))} className={`p-1 rounded ${theme.hover}`}>+</button>

          <div className={`w-px h-6 mx-1 ${theme.border}`} />

          {/* Session Timer */}
          <div className={`px-2 py-1 rounded-lg text-xs ${theme.hover} cursor-pointer`} onClick={() => setActivePanel(activePanel === 'timer' ? null : 'timer')} title="Session Timer">
            ⏱️ {formatTime(sessionSeconds)}
          </div>

          <button onClick={() => setShowExportModal(true)} className={`p-1.5 rounded-lg ${theme.hover}`} title="Export">💾</button>
          <button onClick={() => setActivePanel(activePanel === 'sounds' ? null : 'sounds')} className={`p-1.5 rounded-lg ${Object.keys(activeSounds).length > 0 || isPlaying ? 'bg-green-500 text-white' : theme.hover}`} title="Sounds">
            {isPlaying || Object.keys(activeSounds).length > 0 ? '🎵' : '🎶'}
          </button>
          <button onClick={() => setShowBreathing(!showBreathing)} className={`p-1.5 rounded-lg ${showBreathing ? 'bg-blue-500 text-white' : theme.hover}`} title="Breathing Exercise">
            🫁
          </button>
          <button onClick={() => setFocusMode(!focusMode)} className={`p-1.5 rounded-lg ${focusMode ? 'bg-purple-500 text-white' : theme.hover}`} title="Focus Mode (F)">
            {focusMode ? '🎯' : '👁️'}
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className={`p-1.5 rounded-lg ${theme.hover}`} title="Dark Mode">
            {darkMode ? '☀️' : '🌙'}
          </button>

          {isMobile && (
            <button onClick={() => setShowMobileTools(!showMobileTools)} className={`p-1.5 rounded-lg ${theme.hover}`}>
              🎨
            </button>
          )}
        </div>
      </div>
      )}

      {/* Sounds Panel (Music + Ambient) */}
      {activePanel === 'sounds' && (
        <div className={`absolute top-14 right-4 ${theme.panel} rounded-xl shadow-2xl border ${theme.border} p-3 z-50 w-80 max-h-96 overflow-y-auto`}>
          <div className="text-sm font-medium mb-2">🎵 Background Music</div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {musicTracks.map(track => (
              <button
                key={track.name}
                onClick={() => isPlaying && currentTrack?.name === track.name ? stopMusic() : playTrack(track)}
                className={`p-2 rounded-lg text-center transition-all ${currentTrack?.name === track.name ? 'bg-green-500 text-white' : theme.hover}`}
              >
                <div className="text-lg">{track.emoji}</div>
                <div className="text-xs truncate">{track.name}</div>
              </button>
            ))}
          </div>

          <div className="text-sm font-medium mb-2">🌿 Ambient Sounds</div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {ambientSounds.map(sound => (
              <button
                key={sound.id}
                onClick={() => {
                  setActiveSounds(prev => {
                    if (prev[sound.id]) {
                      const { [sound.id]: _, ...rest } = prev;
                      return rest;
                    }
                    return { ...prev, [sound.id]: 0.5 };
                  });
                }}
                className={`p-2 rounded-lg text-center transition-all ${activeSounds[sound.id] !== undefined ? 'bg-green-500 text-white' : theme.hover}`}
                title={sound.name}
              >
                <div className="text-lg">{sound.emoji}</div>
              </button>
            ))}
          </div>

          {Object.keys(activeSounds).length > 0 && (
            <div className="space-y-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className={`text-xs ${theme.textMuted}`}>Volume Controls</div>
              {Object.entries(activeSounds).map(([id, volume]) => {
                const sound = ambientSounds.find(s => s.id === id);
                return (
                  <div key={id} className="flex items-center gap-2">
                    <span className="text-sm w-6">{sound?.emoji}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume * 100}
                      onChange={(e) => setActiveSounds(prev => ({ ...prev, [id]: e.target.value / 100 }))}
                      className="flex-1 accent-green-500"
                    />
                    <button
                      onClick={() => setActiveSounds(prev => {
                        const { [id]: _, ...rest } = prev;
                        return rest;
                      })}
                      className="text-red-500 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {(isPlaying || Object.keys(activeSounds).length > 0) && (
            <button
              onClick={() => { stopMusic(); setActiveSounds({}); }}
              className="mt-3 w-full py-2 bg-red-500 text-white rounded-lg text-sm"
            >
              ⏹️ Stop All Sounds
            </button>
          )}
        </div>
      )}

      {/* Timer Settings Panel */}
      {activePanel === 'timer' && (
        <div className={`absolute top-14 right-20 ${theme.panel} rounded-xl shadow-2xl border ${theme.border} p-3 z-50 w-64`}>
          <div className="text-sm font-medium mb-3">⏱️ Session Timer</div>
          <div className="text-2xl font-bold text-center mb-3 font-mono">
            {formatTime(sessionSeconds)}
          </div>
          <div className={`text-xs ${theme.textMuted} mb-2`}>Break Reminder</div>
          <label className="flex items-center gap-2 text-sm mb-2">
            <input
              type="checkbox"
              checked={breakReminderEnabled}
              onChange={(e) => setBreakReminderEnabled(e.target.checked)}
              className="accent-purple-500"
            />
            Enable break reminders
          </label>
          {breakReminderEnabled && (
            <div className="flex items-center gap-2 text-sm">
              <span>Every</span>
              <select
                value={breakInterval}
                onChange={(e) => setBreakInterval(Number(e.target.value))}
                className={`px-2 py-1 rounded border ${theme.border} ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              >
                <option value={15}>15 min</option>
                <option value={20}>20 min</option>
                <option value={25}>25 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Break Reminder Modal */}
      {showBreakReminder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${theme.panel} rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center`}>
            <div className="text-5xl mb-3">☕</div>
            <h3 className="text-xl font-bold mb-2">Time for a Break!</h3>
            <p className={`${theme.textMuted} mb-4`}>
              You've been drawing for {breakInterval} minutes. Take a short break to:
            </p>
            <ul className={`text-left text-sm ${theme.textMuted} mb-4 space-y-1`}>
              <li>• Stretch your hands and wrists</li>
              <li>• Look away from the screen</li>
              <li>• Get some water</li>
            </ul>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowBreakReminder(false); setLastBreakTime(Date.now()); }}
                className={`flex-1 py-2 rounded-lg ${theme.hover}`}
              >
                Skip
              </button>
              <button
                onClick={() => { setShowBreakReminder(false); setLastBreakTime(Date.now()); }}
                className="flex-1 py-2 bg-green-500 text-white rounded-lg"
              >
                I took a break ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breathing Exercise Overlay */}
      {showBreathing && (
        <div
          className="fixed bottom-20 right-4 z-40"
          style={{ pointerEvents: 'auto' }}
        >
          <div className={`${theme.panel} rounded-2xl shadow-2xl border ${theme.border} p-4 w-64`}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">🫁 Breathing</span>
              <button onClick={() => setShowBreathing(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="flex justify-center mb-3">
              <div
                className="relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500"
                style={{
                  backgroundColor: breathingPhase === 'inhale' ? '#93C5FD' :
                    breathingPhase === 'exhale' ? '#C4B5FD' : '#D1D5DB',
                  transform: `scale(${breathingPhase === 'inhale' ? 0.6 + breathingProgress * 0.4 :
                    breathingPhase === 'exhale' ? 1 - breathingProgress * 0.4 : 1})`,
                  boxShadow: `0 0 ${20 + breathingProgress * 20}px ${breathingPhase === 'inhale' ? '#93C5FD' : '#C4B5FD'}`
                }}
              >
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {breathingPhase === 'hold1' || breathingPhase === 'hold2' ? 'Hold' : breathingPhase}
                </span>
              </div>
            </div>

            <select
              value={breathingPattern.id}
              onChange={(e) => setBreathingPattern(breathingPatterns.find(p => p.id === e.target.value))}
              className={`w-full px-2 py-1 rounded border ${theme.border} text-sm ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
            >
              {breathingPatterns.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (desktop) - hidden in focus mode */}
        {!isMobile && !focusMode && (
          <div className={`w-56 ${theme.panel} border-r ${theme.border} flex flex-col overflow-hidden`}>
            {/* Tool Options */}
            <div className={`p-3 border-b ${theme.border}`}>
              {(activeTool === 'brush' || activeTool === 'eraser') && (
                <>
                  <div className={`text-xs font-medium ${theme.textMuted} mb-2`}>Brush Type</div>
                  <div className="grid grid-cols-5 gap-1 mb-3">
                    {brushTypes.map(brush => (
                      <button
                        key={brush.id}
                        onClick={() => setBrushType(brush)}
                        className={`p-1.5 rounded-lg text-base transition-all ${brushType.id === brush.id ? theme.active : theme.hover}`}
                        title={brush.name}
                      >
                        {brush.icon}
                      </button>
                    ))}
                  </div>
                  <div className={`text-xs font-medium ${theme.textMuted} mb-1`}>Size: {brushSize}px</div>
                  <input type="range" min="2" max="80" value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} className="w-full accent-purple-500" />
                  <div className={`text-xs font-medium ${theme.textMuted} mt-2 mb-1`}>Opacity: {Math.round(colorOpacity * 100)}%</div>
                  <input type="range" min="10" max="100" value={colorOpacity * 100} onChange={e => setColorOpacity(e.target.value / 100)} className="w-full accent-purple-500" />

                  <div className={`text-xs font-medium ${theme.textMuted} mt-2 mb-1`}>Stabilization: {['Off', 'Low', 'Medium', 'High', 'Max'][brushStabilization]}</div>
                  <input type="range" min="0" max="4" value={brushStabilization} onChange={e => setBrushStabilization(Number(e.target.value))} className="w-full accent-purple-500" />
                </>
              )}

              {activeTool === 'shape' && (
                <>
                  <div className={`text-xs font-medium ${theme.textMuted} mb-2`}>Shape Type</div>
                  <div className="grid grid-cols-4 gap-1 mb-3">
                    {shapeTools.map(shape => (
                      <button
                        key={shape.id}
                        onClick={() => setShapeType(shape)}
                        className={`p-1.5 rounded-lg text-lg transition-all ${shapeType.id === shape.id ? theme.active : theme.hover}`}
                        title={shape.name}
                      >
                        {shape.icon}
                      </button>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={shapeFill} onChange={e => setShapeFill(e.target.checked)} className="accent-purple-500" />
                    Fill shape
                  </label>
                </>
              )}

              {/* Symmetry */}
              <div className={`text-xs font-medium ${theme.textMuted} mt-3 mb-2`}>Symmetry</div>
              <div className="grid grid-cols-4 gap-1">
                {symmetryModes.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setSymmetryMode(mode)}
                    className={`p-1.5 rounded-lg text-sm transition-all ${symmetryMode.id === mode.id ? theme.active : theme.hover}`}
                    title={mode.name}
                  >
                    {mode.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className={`p-3 border-b ${theme.border}`}>
              <div className={`text-xs font-medium ${theme.textMuted} mb-2`}>Color</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-inner" style={{ backgroundColor: selectedColor, opacity: colorOpacity }} />
                <input
                  type="text"
                  value={hexInput}
                  onChange={e => handleHexChange(e.target.value)}
                  className={`flex-1 px-2 py-1 text-sm rounded-lg border ${theme.border} ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                  placeholder="#FFFFFF"
                />
              </div>
              <div className="flex gap-1 mb-2 flex-wrap">
                {Object.keys(colorPalettes).map(p => (
                  <button
                    key={p}
                    onClick={() => { setCurrentPalette(p); setSelectedColor(colorPalettes[p][0]); setHexInput(colorPalettes[p][0]); }}
                    className={`px-2 py-0.5 rounded-full text-xs capitalize transition-all ${currentPalette === p ? theme.active : theme.hover}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-1">
                {colorPalettes[currentPalette].map(color => (
                  <button
                    key={color}
                    onClick={() => { setSelectedColor(color); setHexInput(color); }}
                    className={`w-8 h-8 rounded-lg transition-all ${selectedColor === color ? 'ring-2 ring-purple-500 ring-offset-2 scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {recentColors.length > 0 && (
                <div className="mt-2">
                  <div className={`text-xs ${theme.textMuted} mb-1`}>Recent</div>
                  <div className="flex gap-1 flex-wrap">
                    {recentColors.map((c, i) => (
                      <button key={i} onClick={() => { setSelectedColor(c); setHexInput(c); }} className="w-6 h-6 rounded-md border border-gray-300" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Color Harmony */}
              <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => { setShowColorHarmony(!showColorHarmony); if (!showColorHarmony) setHarmonyColors(generateColorHarmony(selectedColor, selectedHarmony)); }}
                  className={`w-full text-left text-xs font-medium ${theme.textMuted} flex justify-between items-center`}
                >
                  <span>🎨 Color Harmony</span>
                  <span>{showColorHarmony ? '▼' : '▶'}</span>
                </button>
                {showColorHarmony && (
                  <div className="mt-2">
                    <select
                      value={selectedHarmony}
                      onChange={(e) => setSelectedHarmony(e.target.value)}
                      className={`w-full px-2 py-1 text-xs rounded border ${theme.border} ${darkMode ? 'bg-gray-700' : 'bg-white'} mb-2`}
                    >
                      {colorHarmonyTypes.map(h => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                    <div className="flex gap-1">
                      {harmonyColors.map((color, i) => (
                        <button
                          key={i}
                          onClick={() => { setSelectedColor(color); setHexInput(color); }}
                          className={`flex-1 h-8 rounded-md transition-all hover:scale-105 ${selectedColor === color ? 'ring-2 ring-purple-500' : ''}`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Canvas Options */}
            <div className={`p-3 border-b ${theme.border}`}>
              <div className={`text-xs font-medium ${theme.textMuted} mb-2`}>Canvas</div>
              <div className="flex items-center gap-2 mb-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} className="accent-purple-500" />
                  Grid
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={snapToGrid} onChange={e => setSnapToGrid(e.target.checked)} className="accent-purple-500" />
                  Snap
                </label>
              </div>
              <div className={`text-xs ${theme.textMuted} mb-1`}>Background</div>
              <div className="grid grid-cols-8 gap-1">
                {backgroundColors.slice(0, 16).map(color => (
                  <button
                    key={color}
                    onClick={() => setBackgroundColor(color)}
                    className={`w-5 h-5 rounded-md border transition-all ${backgroundColor === color ? 'ring-2 ring-purple-500' : 'border-gray-300'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Clear */}
            <div className="p-3">
              <button onClick={clearDrawing} className="w-full py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition-all">
                🗑️ Clear Canvas
              </button>
            </div>
          </div>
        )}

        {/* Canvas Area */}
        <div ref={containerRef} className="flex-1 flex items-center justify-center p-2 overflow-hidden" style={{ cursor: isPanning ? 'grab' : 'default' }}>
          <div
            className="relative rounded-2xl shadow-2xl overflow-hidden transition-transform"
            style={{
              width: canvasWidth * zoom,
              height: canvasHeight * zoom,
              transform: `translate(${pan.x}px, ${pan.y}px)`,
            }}
          >
            {showCelebration && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 z-20 animate-pulse">
                <div className="text-center">
                  <div className="text-6xl mb-2 animate-bounce">🌟</div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Beautiful!</p>
                </div>
              </div>
            )}

            <svg
              ref={canvasRef}
              viewBox="0 0 420 300"
              className="w-full h-full touch-none"
              style={{ backgroundColor }}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
            >
              {/* Grid */}
              {showGrid && (
                <g opacity="0.25">
                  {Array.from({ length: Math.ceil(420 / gridSize) + 1 }).map((_, i) => (
                    <line key={`v${i}`} x1={i * gridSize} y1="0" x2={i * gridSize} y2="300" stroke={darkMode ? '#666' : '#aaa'} strokeWidth="0.5" />
                  ))}
                  {Array.from({ length: Math.ceil(300 / gridSize) + 1 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * gridSize} x2="420" y2={i * gridSize} stroke={darkMode ? '#666' : '#aaa'} strokeWidth="0.5" />
                  ))}
                </g>
              )}

              {/* Symmetry guides */}
              {symmetryMode.id !== 'none' && (
                <g opacity="0.15" strokeDasharray="4,4">
                  {(symmetryMode.id === 'horizontal' || symmetryMode.id === 'quad') && (
                    <line x1="210" y1="0" x2="210" y2="300" stroke="#9333ea" strokeWidth="1.5" />
                  )}
                  {(symmetryMode.id === 'vertical' || symmetryMode.id === 'quad') && (
                    <line x1="0" y1="150" x2="420" y2="150" stroke="#9333ea" strokeWidth="1.5" />
                  )}
                  {symmetryMode.spokes && Array.from({ length: symmetryMode.spokes }).map((_, i) => {
                    const angle = (2 * Math.PI * i) / symmetryMode.spokes;
                    return <line key={i} x1="210" y1="150" x2={210 + 200 * Math.cos(angle)} y2={150 + 200 * Math.sin(angle)} stroke="#9333ea" strokeWidth="1" />;
                  })}
                </g>
              )}

              {/* Layers */}
              {layers.filter(l => l.visible).map(layer => (
                <g key={layer.id} opacity={layer.opacity}>
                  {layer.paths.map((path, i) => path.isShape ? (
                    <path key={path.id || i} d={shapeToPath(path)} fill={path.fill ? path.color : 'none'} stroke={path.color} strokeWidth={path.strokeWidth} opacity={path.opacity} />
                  ) : (
                    <path
                      key={path.id || i}
                      d={smoothPath(path.points, path.stabilization || 0)}
                      stroke={path.color}
                      strokeWidth={path.size}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity={path.opacity}
                      style={{ filter: path.brushType?.softness > 0 ? `blur(${path.brushType.softness}px)` : 'none' }}
                    />
                  ))}
                </g>
              ))}

              {/* Current path preview */}
              {currentPath && currentPath.map((path, i) => path.points.length > 1 && (
                <path
                  key={i}
                  d={smoothPath(path.points, brushStabilization)}
                  stroke={path.color}
                  strokeWidth={path.size}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={path.opacity}
                />
              ))}

              {/* Current shape preview */}
              {currentShape && (
                <path d={shapeToPath(currentShape)} fill={currentShape.fill ? currentShape.color : 'none'} stroke={currentShape.color} strokeWidth={currentShape.strokeWidth} opacity={0.6} strokeDasharray="4,4" />
              )}

              {/* Pre-made drawings */}
              {drawing.paths.map(path => {
                const fillColor = filledColors[`${currentDrawing}-${path.id}`] || 'transparent';
                return (
                  <path
                    key={path.id}
                    d={path.d}
                    fill={fillColor}
                    stroke={darkMode ? '#666' : '#9CA3AF'}
                    strokeWidth={2}
                    strokeLinecap="round"
                    className="transition-colors duration-200"
                    onClick={() => handlePathClick(path.id)}
                    style={{ cursor: activeTool === 'fill' ? 'pointer' : 'default', pointerEvents: activeTool === 'fill' ? 'auto' : 'none' }}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Sidebar - Layers (desktop) - hidden in focus mode */}
        {!isMobile && !focusMode && (
          <div className={`w-56 ${theme.panel} border-l ${theme.border} flex flex-col overflow-hidden`}>
            <div className={`flex items-center justify-between p-2 border-b ${theme.border}`}>
              <span className={`text-xs font-medium ${theme.textMuted}`}>Layers</span>
              <button onClick={addLayer} className={`p-1 rounded ${theme.hover} text-sm`} title="Add layer">➕</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {[...layers].reverse().map(layer => (
                <div
                  key={layer.id}
                  draggable
                  onDragStart={() => handleLayerDragStart(layer.id)}
                  onDragOver={handleLayerDragOver}
                  onDrop={() => handleLayerDrop(layer.id)}
                  onClick={() => setActiveLayerId(layer.id)}
                  className={`flex items-center gap-2 px-2 py-2 cursor-pointer border-b ${theme.border} transition-all ${
                    activeLayerId === layer.id ? 'bg-purple-100 dark:bg-purple-900/40' : theme.hover
                  } ${draggedLayerId === layer.id ? 'opacity-50' : ''}`}
                >
                  <button onClick={e => { e.stopPropagation(); toggleLayerVisibility(layer.id); }} className={layer.visible ? '' : 'opacity-30'}>
                    👁️
                  </button>
                  <button onClick={e => { e.stopPropagation(); toggleLayerLock(layer.id); }}>
                    {layer.locked ? '🔒' : '🔓'}
                  </button>
                  <span className={`flex-1 text-sm truncate ${!layer.visible ? 'opacity-50' : ''}`}>{layer.name}</span>
                  <button onClick={e => { e.stopPropagation(); duplicateLayer(layer.id); }} className="opacity-50 hover:opacity-100 text-xs">📋</button>
                  {layers.length > 1 && (
                    <button onClick={e => { e.stopPropagation(); deleteLayer(layer.id); }} className="opacity-50 hover:opacity-100 text-xs text-red-500">🗑️</button>
                  )}
                </div>
              ))}
            </div>
            {getActiveLayer() && (
              <div className={`p-3 border-t ${theme.border}`}>
                <div className={`text-xs ${theme.textMuted} mb-1`}>Layer Opacity</div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={getActiveLayer().opacity * 100}
                  onChange={e => setLayerOpacity(activeLayerId, e.target.value / 100)}
                  className="w-full accent-purple-500"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Tools Panel */}
      {isMobile && showMobileTools && (
        <div className={`absolute bottom-0 left-0 right-0 ${theme.panel} rounded-t-2xl shadow-2xl p-4 z-30 max-h-[70vh] overflow-y-auto`}>
          <div className="flex justify-center mb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Tools */}
          <div className="flex gap-2 mb-4 justify-center">
            {[
              { id: 'brush', icon: '🖌️' },
              { id: 'eraser', icon: '🧽' },
              { id: 'fill', icon: '🪣' },
              { id: 'shape', icon: '⬜' },
            ].map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`w-12 h-12 rounded-xl text-xl transition-all ${activeTool === tool.id ? theme.active : theme.hover}`}
              >
                {tool.icon}
              </button>
            ))}
          </div>

          {/* Brush options */}
          {(activeTool === 'brush' || activeTool === 'eraser') && (
            <div className="mb-4">
              <div className="grid grid-cols-5 gap-2 mb-3">
                {brushTypes.slice(0, 5).map(brush => (
                  <button
                    key={brush.id}
                    onClick={() => setBrushType(brush)}
                    className={`p-2 rounded-lg text-lg ${brushType.id === brush.id ? theme.active : theme.hover}`}
                  >
                    {brush.icon}
                  </button>
                ))}
              </div>
              <div className={`text-xs ${theme.textMuted} mb-1`}>Size: {brushSize}px</div>
              <input type="range" min="2" max="60" value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} className="w-full accent-purple-500" />
            </div>
          )}

          {/* Colors */}
          <div>
            <div className="flex gap-1 mb-2 flex-wrap justify-center">
              {Object.keys(colorPalettes).slice(0, 4).map(p => (
                <button
                  key={p}
                  onClick={() => { setCurrentPalette(p); setSelectedColor(colorPalettes[p][0]); }}
                  className={`px-3 py-1 rounded-full text-xs capitalize ${currentPalette === p ? theme.active : theme.hover}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-10 gap-2">
              {colorPalettes[currentPalette].map(color => (
                <button
                  key={color}
                  onClick={() => { setSelectedColor(color); setHexInput(color); }}
                  className={`w-8 h-8 rounded-full transition-all ${selectedColor === color ? 'ring-2 ring-purple-500 ring-offset-2 scale-110' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button onClick={() => setShowMobileTools(false)} className={`w-full mt-4 py-2 ${theme.hover} rounded-lg text-sm`}>
            Close
          </button>
        </div>
      )}

      {/* Status Bar - hidden in focus mode */}
      {!focusMode && (
      <div className={`flex items-center justify-between px-3 py-1 text-xs ${theme.panel} ${theme.textMuted} border-t ${theme.border}`}>
        <div className="flex items-center gap-3">
          <span>{drawing.icon} {drawing.name}</span>
          <span>•</span>
          <span>Layer: {getActiveLayer()?.name}</span>
          {symmetryMode.id !== 'none' && <span className="text-purple-500">• Symmetry: {symmetryMode.name}</span>}
        </div>
        <div className="flex items-center gap-3">
          {history.length > 0 && <span>History: {historyIndex + 1}/{history.length}</span>}
          <span>{Math.round(zoom * 100)}%</span>
        </div>
      </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowExportModal(false)}>
          <div className={`${theme.panel} rounded-2xl p-6 max-w-sm w-full shadow-2xl`} onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Export Artwork</h3>
            <div className="mb-4">
              <div className={`text-sm ${theme.textMuted} mb-2`}>Format</div>
              <div className="flex gap-2">
                {['png', 'jpg', 'svg'].map(f => (
                  <button
                    key={f}
                    onClick={() => setExportFormat(f)}
                    className={`flex-1 py-2 rounded-lg uppercase text-sm font-medium transition-all ${exportFormat === f ? theme.active : theme.hover}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {exportFormat !== 'svg' && (
              <div className="mb-4">
                <div className={`text-sm ${theme.textMuted} mb-2`}>Quality</div>
                <div className="flex gap-2">
                  {[{ v: 1, l: 'Low' }, { v: 2, l: 'Medium' }, { v: 4, l: 'High' }].map(q => (
                    <button
                      key={q.v}
                      onClick={() => setExportQuality(q.v)}
                      className={`flex-1 py-2 rounded-lg text-sm transition-all ${exportQuality === q.v ? theme.active : theme.hover}`}
                    >
                      {q.l}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowExportModal(false)} className={`flex-1 py-3 rounded-xl ${theme.hover} font-medium`}>Cancel</button>
              <button onClick={() => saveArtwork()} disabled={isSaving} className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Export'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Music indicator */}
      {isPlaying && !activePanel && (
        <div className={`fixed bottom-16 right-4 ${theme.panel} rounded-full px-4 py-2 shadow-lg flex items-center gap-2 z-20`}>
          <span className="animate-pulse">{currentTrack?.emoji}</span>
          <span className="text-sm">{currentTrack?.name}</span>
          <button onClick={stopMusic} className="text-red-500">⏹️</button>
        </div>
      )}
    </div>
  );
}
