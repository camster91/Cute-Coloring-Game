import { useState, useCallback, useMemo } from 'react';

// Preset gradients
export const presetGradients = [
  { id: 'sunset', name: 'Sunset', colors: ['#FF6B6B', '#FFE66D'], angle: 45 },
  { id: 'ocean', name: 'Ocean', colors: ['#667eea', '#764ba2'], angle: 135 },
  { id: 'forest', name: 'Forest', colors: ['#11998e', '#38ef7d'], angle: 90 },
  { id: 'dawn', name: 'Dawn', colors: ['#f093fb', '#f5576c'], angle: 120 },
  { id: 'sky', name: 'Sky', colors: ['#4facfe', '#00f2fe'], angle: 180 },
  { id: 'peach', name: 'Peach', colors: ['#ffecd2', '#fcb69f'], angle: 45 },
  { id: 'lavender', name: 'Lavender', colors: ['#a18cd1', '#fbc2eb'], angle: 135 },
  { id: 'mint', name: 'Mint', colors: ['#d4fc79', '#96e6a1'], angle: 90 },
  { id: 'fire', name: 'Fire', colors: ['#f12711', '#f5af19'], angle: 0 },
  { id: 'night', name: 'Night', colors: ['#0f0c29', '#302b63', '#24243e'], angle: 180 },
  { id: 'rainbow', name: 'Rainbow', colors: ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff', '#8000ff'], angle: 90 },
  { id: 'pastel', name: 'Pastel', colors: ['#ffecd2', '#fcb69f', '#ff9a9e', '#fecfef'], angle: 45 },
];

// Gradient types
export const gradientTypes = [
  { id: 'linear', name: 'Linear', icon: '→' },
  { id: 'radial', name: 'Radial', icon: '◉' },
];

/**
 * Hook for managing gradient editor state
 */
export default function useGradientState() {
  // Current gradient configuration
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [gradientType, setGradientType] = useState('linear');
  const [gradientAngle, setGradientAngle] = useState(90);
  const [gradientColors, setGradientColors] = useState([
    { color: '#FF6B6B', position: 0 },
    { color: '#FFE66D', position: 100 },
  ]);

  // For radial gradients
  const [radialPosition, setRadialPosition] = useState({ x: 50, y: 50 }); // percentage

  // Saved custom gradients
  const [customGradients, setCustomGradients] = useState(() => {
    try {
      const saved = localStorage.getItem('calmDrawing_customGradients');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to load custom gradients:', e);
      return [];
    }
  });

  // Generate CSS gradient string
  const gradientCSS = useMemo(() => {
    const sortedColors = [...gradientColors].sort((a, b) => a.position - b.position);
    const colorStops = sortedColors.map(c => `${c.color} ${c.position}%`).join(', ');

    if (gradientType === 'radial') {
      return `radial-gradient(circle at ${radialPosition.x}% ${radialPosition.y}%, ${colorStops})`;
    }
    return `linear-gradient(${gradientAngle}deg, ${colorStops})`;
  }, [gradientType, gradientAngle, gradientColors, radialPosition]);

  // Generate SVG gradient definition
  const generateSVGGradient = useCallback((id = 'brush-gradient') => {
    const sortedColors = [...gradientColors].sort((a, b) => a.position - b.position);

    if (gradientType === 'radial') {
      return {
        type: 'radialGradient',
        id,
        cx: `${radialPosition.x}%`,
        cy: `${radialPosition.y}%`,
        r: '50%',
        stops: sortedColors.map(c => ({
          offset: `${c.position}%`,
          color: c.color,
        })),
      };
    }

    // Convert angle to SVG coordinates
    const angleRad = (gradientAngle - 90) * (Math.PI / 180);
    const x1 = 50 - Math.cos(angleRad) * 50;
    const y1 = 50 - Math.sin(angleRad) * 50;
    const x2 = 50 + Math.cos(angleRad) * 50;
    const y2 = 50 + Math.sin(angleRad) * 50;

    return {
      type: 'linearGradient',
      id,
      x1: `${x1}%`,
      y1: `${y1}%`,
      x2: `${x2}%`,
      y2: `${y2}%`,
      stops: sortedColors.map(c => ({
        offset: `${c.position}%`,
        color: c.color,
      })),
    };
  }, [gradientType, gradientAngle, gradientColors, radialPosition]);

  // Add a color stop
  const addColorStop = useCallback((color = '#888888', position = 50) => {
    setGradientColors(prev => [...prev, { color, position }]);
  }, []);

  // Remove a color stop
  const removeColorStop = useCallback((index) => {
    if (gradientColors.length <= 2) return; // Minimum 2 stops
    setGradientColors(prev => prev.filter((_, i) => i !== index));
  }, [gradientColors.length]);

  // Update a color stop
  const updateColorStop = useCallback((index, updates) => {
    setGradientColors(prev => prev.map((stop, i) =>
      i === index ? { ...stop, ...updates } : stop
    ));
  }, []);

  // Load a preset gradient
  const loadPreset = useCallback((preset) => {
    const positions = preset.colors.map((_, i) =>
      Math.round((i / (preset.colors.length - 1)) * 100)
    );
    setGradientColors(preset.colors.map((color, i) => ({
      color,
      position: positions[i],
    })));
    setGradientAngle(preset.angle);
    setGradientType('linear');
    setGradientEnabled(true);
  }, []);

  // Save current gradient as custom
  const saveCustomGradient = useCallback((name) => {
    const newGradient = {
      id: `custom-${Date.now()}`,
      name,
      colors: gradientColors.map(c => c.color),
      positions: gradientColors.map(c => c.position),
      angle: gradientAngle,
      type: gradientType,
      radialPosition: { ...radialPosition },
    };
    const updated = [...customGradients, newGradient];
    setCustomGradients(updated);
    try { localStorage.setItem('calmDrawing_customGradients', JSON.stringify(updated)); } catch (e) {}
    return newGradient.id;
  }, [gradientColors, gradientAngle, gradientType, radialPosition, customGradients]);

  // Delete a custom gradient
  const deleteCustomGradient = useCallback((id) => {
    const updated = customGradients.filter(g => g.id !== id);
    setCustomGradients(updated);
    try { localStorage.setItem('calmDrawing_customGradients', JSON.stringify(updated)); } catch (e) {}
  }, [customGradients]);

  // Load a custom gradient
  const loadCustomGradient = useCallback((gradient) => {
    setGradientColors(gradient.colors.map((color, i) => ({
      color,
      position: gradient.positions[i],
    })));
    setGradientAngle(gradient.angle);
    setGradientType(gradient.type || 'linear');
    if (gradient.radialPosition) {
      setRadialPosition(gradient.radialPosition);
    }
    setGradientEnabled(true);
  }, []);

  // Reverse gradient colors
  const reverseGradient = useCallback(() => {
    setGradientColors(prev => {
      const reversed = [...prev].reverse();
      return reversed.map((stop, i) => ({
        ...stop,
        position: Math.round((i / (reversed.length - 1)) * 100),
      }));
    });
  }, []);

  // Rotate gradient angle by 45 degrees
  const rotateGradient = useCallback(() => {
    setGradientAngle(prev => (prev + 45) % 360);
  }, []);

  return {
    // Enable/disable
    gradientEnabled,
    setGradientEnabled,

    // Gradient configuration
    gradientType,
    setGradientType,
    gradientAngle,
    setGradientAngle,
    gradientColors,
    setGradientColors,
    radialPosition,
    setRadialPosition,

    // Generated values
    gradientCSS,
    generateSVGGradient,

    // Color stop actions
    addColorStop,
    removeColorStop,
    updateColorStop,

    // Custom gradients
    customGradients,
    loadPreset,
    saveCustomGradient,
    deleteCustomGradient,
    loadCustomGradient,

    // Utility actions
    reverseGradient,
    rotateGradient,
  };
}
