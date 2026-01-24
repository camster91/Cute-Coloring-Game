import { useState, useRef } from 'react';

// Brush types with visual characteristics
export const brushTypes = [
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
export const shapeTools = [
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
export const symmetryModes = [
  { id: 'none', name: 'Off', icon: '⊘', lines: 0 },
  { id: 'horizontal', name: 'Horizontal', icon: '↔️', lines: 1 },
  { id: 'vertical', name: 'Vertical', icon: '↕️', lines: 1 },
  { id: 'quad', name: 'Quad', icon: '✚', lines: 2 },
  { id: 'radial4', name: '4-Way', icon: '✦', spokes: 4 },
  { id: 'radial6', name: '6-Way', icon: '✶', spokes: 6 },
  { id: 'radial8', name: '8-Way', icon: '❋', spokes: 8 },
  { id: 'radial12', name: '12-Way', icon: '✺', spokes: 12 },
];

/**
 * Hook for managing drawing tool state
 */
export default function useToolState() {
  // Active tool (brush, eraser, fill, shape, pan)
  const [activeTool, setActiveTool] = useState('brush');

  // Brush settings
  const [brushType, setBrushType] = useState(brushTypes[0]);
  const [brushSize, setBrushSize] = useState(12);
  const [brushStabilization, setBrushStabilization] = useState(0); // 0-4 levels

  // Shape settings
  const [shapeType, setShapeType] = useState(shapeTools[0]);
  const [shapeFill, setShapeFill] = useState(true);

  // Symmetry
  const [symmetryMode, setSymmetryMode] = useState(symmetryModes[0]);

  // Lazy brush (string/rope mode for precision)
  const [lazyBrushEnabled, setLazyBrushEnabled] = useState(false);
  const [lazyBrushRadius, setLazyBrushRadius] = useState(30);
  const lazyBrushPosRef = useRef({ x: 0, y: 0 });
  const [lazyBrushIndicator, setLazyBrushIndicator] = useState(null);

  return {
    // Tool selection
    activeTool,
    setActiveTool,

    // Brush
    brushType,
    setBrushType,
    brushSize,
    setBrushSize,
    brushStabilization,
    setBrushStabilization,

    // Shape
    shapeType,
    setShapeType,
    shapeFill,
    setShapeFill,

    // Symmetry
    symmetryMode,
    setSymmetryMode,

    // Lazy brush
    lazyBrushEnabled,
    setLazyBrushEnabled,
    lazyBrushRadius,
    setLazyBrushRadius,
    lazyBrushPosRef,
    lazyBrushIndicator,
    setLazyBrushIndicator,

    // Constants for external use
    brushTypes,
    shapeTools,
    symmetryModes,
  };
}
