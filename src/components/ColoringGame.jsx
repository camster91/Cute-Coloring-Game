import React, { useState, useRef, useEffect, useCallback } from 'react';

// ============ CONSTANTS ============

const colorPalettes = {
  soft: ['#FFB5BA', '#FFDAB3', '#FFF4B5', '#B5EAAA', '#B5D8EB', '#D4B5EB', '#F5CAE0', '#C9E4CA'],
  nature: ['#8FBC8F', '#DEB887', '#87CEEB', '#F0E68C', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'],
  ocean: ['#5DADE2', '#48C9B0', '#76D7C4', '#85C1E9', '#A3E4D7', '#D4E6F1', '#FADBD8', '#F5B7B1'],
  bold: ['#E74C3C', '#F39C12', '#27AE60', '#3498DB', '#9B59B6', '#1ABC9C', '#E91E63', '#FF5722'],
  pastel: ['#E8D5E0', '#D5E8E0', '#E8E5D5', '#D5DEE8', '#E8D5D5', '#D5E8E8', '#E0D5E8', '#E8E0D5'],
  rainbow: ['#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#1DD1A1', '#5F27CD', '#FF6B81', '#00D2D3'],
};

const backgroundColors = ['#FFFFFF', '#FFF8E7', '#E8F5E9', '#E3F2FD', '#FCE4EC', '#F3E5F5', '#FFFDE7', '#E0F7FA', '#FBE9E7', '#1a1a2e', '#16213e', '#0f0f0f'];

// Brush types with their characteristics
const brushTypes = [
  { id: 'pen', name: 'Pen', icon: '✒️', opacity: 1, softness: 0, texture: false },
  { id: 'pencil', name: 'Pencil', icon: '✏️', opacity: 0.8, softness: 0.2, texture: true },
  { id: 'marker', name: 'Marker', icon: '🖊️', opacity: 0.7, softness: 0.1, texture: false },
  { id: 'watercolor', name: 'Watercolor', icon: '🎨', opacity: 0.4, softness: 0.6, texture: true },
  { id: 'crayon', name: 'Crayon', icon: '🖍️', opacity: 0.85, softness: 0.3, texture: true },
  { id: 'airbrush', name: 'Airbrush', icon: '💨', opacity: 0.3, softness: 0.8, texture: false },
  { id: 'calligraphy', name: 'Calligraphy', icon: '🖋️', opacity: 1, softness: 0, texture: false, variable: true },
  { id: 'highlighter', name: 'Highlighter', icon: '🔆', opacity: 0.4, softness: 0.2, texture: false },
];

// Shape tools
const shapeTools = [
  { id: 'rectangle', name: 'Rectangle', icon: '⬜' },
  { id: 'ellipse', name: 'Ellipse', icon: '⭕' },
  { id: 'line', name: 'Line', icon: '➖' },
  { id: 'triangle', name: 'Triangle', icon: '△' },
  { id: 'star', name: 'Star', icon: '⭐' },
  { id: 'arrow', name: 'Arrow', icon: '➡️' },
  { id: 'polygon', name: 'Polygon', icon: '⬡' },
];

// Symmetry modes
const symmetryModes = [
  { id: 'none', name: 'None', icon: '⊘' },
  { id: 'horizontal', name: 'Horizontal', icon: '↔️' },
  { id: 'vertical', name: 'Vertical', icon: '↕️' },
  { id: 'quad', name: 'Quad', icon: '✚' },
  { id: 'radial', name: 'Radial', icon: '❋', spokes: 8 },
];

const musicTracks = [
  { name: 'Gentle Dreams', emoji: '🌙', type: 'lullaby' },
  { name: 'Happy Meadow', emoji: '🌻', type: 'cheerful' },
  { name: 'Ocean Waves', emoji: '🌊', type: 'calm' },
  { name: 'Twinkle Stars', emoji: '✨', type: 'playful' },
  { name: 'Rainy Day', emoji: '🌧️', type: 'peaceful' },
  { name: 'Forest Birds', emoji: '🐦', type: 'nature' },
];

const drawings = [
  {
    name: 'Bunny',
    icon: '🐰',
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
    name: 'Flower',
    icon: '🌸',
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
    name: 'Star',
    icon: '⭐',
    paths: [
      { id: 'star-outer', d: 'M210 20 L240 90 L320 100 L260 150 L280 230 L210 190 L140 230 L160 150 L100 100 L180 90 Z' },
      { id: 'star-inner', d: 'M210 60 L225 100 L270 105 L240 130 L250 175 L210 155 L170 175 L180 130 L150 105 L195 100 Z' },
    ]
  },
  {
    name: 'Fish',
    icon: '🐠',
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
    name: 'Butterfly',
    icon: '🦋',
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
    name: 'House',
    icon: '🏠',
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
    name: 'Cat',
    icon: '🐱',
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
    name: 'Heart',
    icon: '❤️',
    paths: [
      { id: 'heart', d: 'M210 280 Q100 200 100 120 Q100 60 160 60 Q210 60 210 120 Q210 60 260 60 Q320 60 320 120 Q320 200 210 280' },
      { id: 'shine1', d: 'M140 100 Q150 80 160 100 Q150 90 140 100' },
      { id: 'shine2', d: 'M130 130 Q135 120 140 130' },
    ]
  },
  {
    name: 'Free',
    icon: '✏️',
    paths: []
  },
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

  const playTrack = (track) => {
    stopMusic();
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);
    gainNodeRef.current.gain.value = 0.15;

    const melody = melodies[track.type];
    let noteIndex = 0;

    const playNote = () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      oscillatorRef.current = audioContextRef.current.createOscillator();
      oscillatorRef.current.type = 'sine';
      oscillatorRef.current.frequency.value = melody[noteIndex % melody.length];
      oscillatorRef.current.connect(gainNodeRef.current);
      oscillatorRef.current.start();
      oscillatorRef.current.stop(audioContextRef.current.currentTime + 0.4);
      noteIndex++;
    };

    playNote();
    intervalRef.current = setInterval(playNote, 500);
    setIsPlaying(true);
    setCurrentTrack(track);
  };

  const stopMusic = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (oscillatorRef.current) try { oscillatorRef.current.stop(); } catch(e) {}
    if (audioContextRef.current) audioContextRef.current.close();
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  return { isPlaying, currentTrack, playTrack, stopMusic };
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
  const [brushSize, setBrushSize] = useState(8);
  const [shapeType, setShapeType] = useState(shapeTools[0]);
  const [shapeFill, setShapeFill] = useState(true);
  const [symmetryMode, setSymmetryMode] = useState(symmetryModes[0]);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [currentPath, setCurrentPath] = useState(null);
  const [currentShape, setCurrentShape] = useState(null);

  // Layers system
  const [layers, setLayers] = useState([
    { id: 'layer-1', name: 'Layer 1', visible: true, locked: false, opacity: 1, paths: [] }
  ]);
  const [activeLayerId, setActiveLayerId] = useState('layer-1');

  // Selection state
  const [selectedElements, setSelectedElements] = useState([]);
  const [selectionBox, setSelectionBox] = useState(null);
  const [transformMode, setTransformMode] = useState(null);

  // UI state
  const [activePanel, setActivePanel] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showRulers, setShowRulers] = useState(false);
  const [recentColors, setRecentColors] = useState([]);
  const [hexInput, setHexInput] = useState('#FFB5BA');

  // History (undo/redo)
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistory = 50;

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [exportFormat, setExportFormat] = useState('png');
  const [exportQuality, setExportQuality] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);

  // Window size
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      // Prevent default for our shortcuts
      if (ctrlKey && ['z', 'y', 's', 'e'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      // Tool shortcuts (only when not typing)
      if (!e.target.matches('input, textarea')) {
        switch (e.key.toLowerCase()) {
          case 'v': setActiveTool('select'); break;
          case 'b': setActiveTool('brush'); break;
          case 'e': if (!ctrlKey) setActiveTool('eraser'); break;
          case 'g': setActiveTool('fill'); break;
          case 'r': setActiveTool('shape'); setShapeType(shapeTools[0]); break;
          case 'o': setActiveTool('shape'); setShapeType(shapeTools[1]); break;
          case 'l': setActiveTool('shape'); setShapeType(shapeTools[2]); break;
          case 'm': setSymmetryMode(prev => {
            const idx = symmetryModes.findIndex(s => s.id === prev.id);
            return symmetryModes[(idx + 1) % symmetryModes.length];
          }); break;
          case '[': setBrushSize(s => Math.max(1, s - 2)); break;
          case ']': setBrushSize(s => Math.min(100, s + 2)); break;
          case ' ': if (!isDrawing) setIsPanning(true); break;
          case 'delete':
          case 'backspace':
            if (selectedElements.length > 0) deleteSelected();
            break;
        }
      }

      // Ctrl/Cmd shortcuts
      if (ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            if (e.shiftKey) redo();
            else undo();
            break;
          case 'y': redo(); break;
          case 's': saveArtwork(); break;
          case 'e': setShowExportModal(true); break;
          case 'a':
            e.preventDefault();
            selectAll();
            break;
        }
      }

      // Zoom with +/-
      if (e.key === '=' || e.key === '+') setZoom(z => Math.min(4, z + 0.1));
      if (e.key === '-') setZoom(z => Math.max(0.25, z - 0.1));
      if (e.key === '0' && ctrlKey) { e.preventDefault(); setZoom(1); setPan({ x: 0, y: 0 }); }
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
  }, [isDrawing, selectedElements]);

  // Wheel zoom
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(z => Math.max(0.25, Math.min(4, z + delta)));
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, []);

  // ============ HISTORY FUNCTIONS ============

  const saveToHistory = useCallback(() => {
    const state = {
      layers: JSON.parse(JSON.stringify(layers)),
      filledColors: { ...filledColors },
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    if (newHistory.length > maxHistory) newHistory.shift();

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [layers, filledColors, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setLayers(previousState.layers);
      setFilledColors(previousState.filledColors);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setLayers(nextState.layers);
      setFilledColors(nextState.filledColors);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  // ============ LAYER FUNCTIONS ============

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

  const deleteLayer = (layerId) => {
    if (layers.length === 1) return;
    const newLayers = layers.filter(l => l.id !== layerId);
    setLayers(newLayers);
    if (activeLayerId === layerId) {
      setActiveLayerId(newLayers[0].id);
    }
  };

  const duplicateLayer = (layerId) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;
    const newLayer = {
      ...JSON.parse(JSON.stringify(layer)),
      id: `layer-${Date.now()}`,
      name: `${layer.name} copy`
    };
    const idx = layers.findIndex(l => l.id === layerId);
    const newLayers = [...layers];
    newLayers.splice(idx + 1, 0, newLayer);
    setLayers(newLayers);
  };

  const toggleLayerVisibility = (layerId) => {
    setLayers(layers.map(l =>
      l.id === layerId ? { ...l, visible: !l.visible } : l
    ));
  };

  const toggleLayerLock = (layerId) => {
    setLayers(layers.map(l =>
      l.id === layerId ? { ...l, locked: !l.locked } : l
    ));
  };

  const setLayerOpacity = (layerId, opacity) => {
    setLayers(layers.map(l =>
      l.id === layerId ? { ...l, opacity } : l
    ));
  };

  const renameLayer = (layerId, name) => {
    setLayers(layers.map(l =>
      l.id === layerId ? { ...l, name } : l
    ));
  };

  const moveLayer = (fromIdx, toIdx) => {
    const newLayers = [...layers];
    const [moved] = newLayers.splice(fromIdx, 1);
    newLayers.splice(toIdx, 0, moved);
    setLayers(newLayers);
  };

  const mergeLayerDown = (layerId) => {
    const idx = layers.findIndex(l => l.id === layerId);
    if (idx <= 0) return;

    const currentLayer = layers[idx];
    const belowLayer = layers[idx - 1];

    const mergedLayer = {
      ...belowLayer,
      paths: [...belowLayer.paths, ...currentLayer.paths]
    };

    const newLayers = layers.filter(l => l.id !== layerId);
    newLayers[idx - 1] = mergedLayer;
    setLayers(newLayers);
    setActiveLayerId(belowLayer.id);
  };

  // ============ DRAWING FUNCTIONS ============

  const getPointerPosition = (e) => {
    const svg = canvasRef.current;
    if (!svg) return { x: 0, y: 0 };

    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let x = ((clientX - rect.left) / rect.width) * 420;
    let y = ((clientY - rect.top) / rect.height) * 300;

    // Apply pan offset
    x = x - pan.x;
    y = y - pan.y;

    // Snap to grid
    if (snapToGrid) {
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }

    return { x, y };
  };

  const getActiveLayer = () => layers.find(l => l.id === activeLayerId);

  const applyBrushEffect = (path, brushType) => {
    return {
      ...path,
      opacity: brushType.opacity * colorOpacity,
      filter: brushType.softness > 0 ? `blur(${brushType.softness * 2}px)` : 'none',
    };
  };

  const generateSymmetricPaths = (points, mode) => {
    const allPaths = [points];
    const centerX = 210;
    const centerY = 150;

    if (mode.id === 'horizontal') {
      allPaths.push(points.map(p => ({ x: 2 * centerX - p.x, y: p.y })));
    } else if (mode.id === 'vertical') {
      allPaths.push(points.map(p => ({ x: p.x, y: 2 * centerY - p.y })));
    } else if (mode.id === 'quad') {
      allPaths.push(points.map(p => ({ x: 2 * centerX - p.x, y: p.y })));
      allPaths.push(points.map(p => ({ x: p.x, y: 2 * centerY - p.y })));
      allPaths.push(points.map(p => ({ x: 2 * centerX - p.x, y: 2 * centerY - p.y })));
    } else if (mode.id === 'radial') {
      const spokes = mode.spokes || 8;
      for (let i = 1; i < spokes; i++) {
        const angle = (2 * Math.PI * i) / spokes;
        allPaths.push(points.map(p => {
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          return {
            x: centerX + dx * Math.cos(angle) - dy * Math.sin(angle),
            y: centerY + dx * Math.sin(angle) + dy * Math.cos(angle)
          };
        }));
      }
    }

    return allPaths;
  };

  const handlePointerDown = (e) => {
    const pos = getPointerPosition(e);
    const activeLayer = getActiveLayer();

    // Check if panning
    if (isPanning) {
      e.preventDefault();
      return;
    }

    // Check if layer is locked
    if (activeLayer?.locked && activeTool !== 'fill' && activeTool !== 'select') {
      return;
    }

    if (activeTool === 'brush' || activeTool === 'eraser') {
      e.preventDefault();
      saveToHistory();
      setIsDrawing(true);
      setCurrentPath({
        id: `path-${Date.now()}`,
        color: activeTool === 'eraser' ? backgroundColor : selectedColor,
        size: brushSize,
        brushType: brushType,
        opacity: activeTool === 'eraser' ? 1 : brushType.opacity * colorOpacity,
        points: [pos],
        isEraser: activeTool === 'eraser'
      });
    } else if (activeTool === 'shape') {
      e.preventDefault();
      saveToHistory();
      setIsDrawing(true);
      setCurrentShape({
        id: `shape-${Date.now()}`,
        type: shapeType.id,
        startX: pos.x,
        startY: pos.y,
        endX: pos.x,
        endY: pos.y,
        color: selectedColor,
        fill: shapeFill,
        strokeWidth: brushSize,
        opacity: colorOpacity
      });
    } else if (activeTool === 'select') {
      // Start selection box or check for element selection
      setSelectionBox({ startX: pos.x, startY: pos.y, endX: pos.x, endY: pos.y });
      setIsDrawing(true);
    } else if (activeTool === 'eyedropper') {
      // Eyedropper - would need canvas pixel reading
      // For now, just switch back to brush
      setActiveTool('brush');
    }
  };

  const handlePointerMove = (e) => {
    if (isPanning && e.buttons === 1) {
      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;
      setPan(p => ({ x: p.x + movementX / zoom, y: p.y + movementY / zoom }));
      return;
    }

    if (!isDrawing) return;

    const pos = getPointerPosition(e);

    if (activeTool === 'brush' || activeTool === 'eraser') {
      e.preventDefault();
      setCurrentPath(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          points: [...prev.points, pos]
        };
      });
    } else if (activeTool === 'shape') {
      e.preventDefault();
      setCurrentShape(prev => {
        if (!prev) return prev;
        let endX = pos.x;
        let endY = pos.y;

        // Shift for perfect shapes
        if (e.shiftKey) {
          const dx = Math.abs(endX - prev.startX);
          const dy = Math.abs(endY - prev.startY);
          const size = Math.max(dx, dy);
          endX = prev.startX + (endX > prev.startX ? size : -size);
          endY = prev.startY + (endY > prev.startY ? size : -size);
        }

        return { ...prev, endX, endY };
      });
    } else if (activeTool === 'select') {
      setSelectionBox(prev => prev ? { ...prev, endX: pos.x, endY: pos.y } : null);
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if ((activeTool === 'brush' || activeTool === 'eraser') && currentPath) {
      if (currentPath.points.length > 1) {
        // Apply symmetry
        const symmetricPaths = generateSymmetricPaths(currentPath.points, symmetryMode);
        const newPaths = symmetricPaths.map((points, i) => ({
          ...currentPath,
          id: `${currentPath.id}-${i}`,
          points
        }));

        setLayers(layers.map(l => {
          if (l.id === activeLayerId) {
            return { ...l, paths: [...l.paths, ...newPaths] };
          }
          return l;
        }));
      }
      setCurrentPath(null);
    } else if (activeTool === 'shape' && currentShape) {
      setLayers(layers.map(l => {
        if (l.id === activeLayerId) {
          return { ...l, paths: [...l.paths, { ...currentShape, isShape: true }] };
        }
        return l;
      }));
      setCurrentShape(null);
    } else if (activeTool === 'select' && selectionBox) {
      // Find elements within selection box
      // For now, just clear selection
      setSelectionBox(null);
    }

    // Add to recent colors
    if (activeTool === 'brush' && !recentColors.includes(selectedColor)) {
      setRecentColors(prev => [selectedColor, ...prev.slice(0, 7)]);
    }
  };

  const pointsToPath = (points) => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  };

  const shapeToPath = (shape) => {
    const { type, startX, startY, endX, endY } = shape;
    const width = endX - startX;
    const height = endY - startY;
    const centerX = startX + width / 2;
    const centerY = startY + height / 2;
    const radius = Math.min(Math.abs(width), Math.abs(height)) / 2;

    switch (type) {
      case 'rectangle':
        return `M ${startX} ${startY} L ${endX} ${startY} L ${endX} ${endY} L ${startX} ${endY} Z`;
      case 'ellipse':
        const rx = Math.abs(width) / 2;
        const ry = Math.abs(height) / 2;
        return `M ${centerX - rx} ${centerY} A ${rx} ${ry} 0 1 0 ${centerX + rx} ${centerY} A ${rx} ${ry} 0 1 0 ${centerX - rx} ${centerY}`;
      case 'line':
        return `M ${startX} ${startY} L ${endX} ${endY}`;
      case 'triangle':
        return `M ${centerX} ${startY} L ${endX} ${endY} L ${startX} ${endY} Z`;
      case 'star':
        const outerR = radius;
        const innerR = radius * 0.4;
        const points = [];
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const angle = (Math.PI * i) / 5 - Math.PI / 2;
          points.push({
            x: centerX + r * Math.cos(angle),
            y: centerY + r * Math.sin(angle)
          });
        }
        return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') + ' Z';
      case 'arrow':
        const arrowWidth = Math.abs(width) * 0.3;
        return `M ${startX} ${centerY - arrowWidth/2} L ${endX - width*0.3} ${centerY - arrowWidth/2} L ${endX - width*0.3} ${startY} L ${endX} ${centerY} L ${endX - width*0.3} ${endY} L ${endX - width*0.3} ${centerY + arrowWidth/2} L ${startX} ${centerY + arrowWidth/2} Z`;
      case 'polygon':
        const sides = 6;
        const polyPoints = [];
        for (let i = 0; i < sides; i++) {
          const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
          polyPoints.push({
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
          });
        }
        return `M ${polyPoints[0].x} ${polyPoints[0].y} ` + polyPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') + ' Z';
      default:
        return '';
    }
  };

  const handlePathClick = (pathId) => {
    if (activeTool !== 'fill') return;
    saveToHistory();
    setFilledColors(prev => ({
      ...prev,
      [`${currentDrawing}-${pathId}`]: selectedColor
    }));

    const drawing = drawings[currentDrawing];
    if (drawing.paths.length > 0) {
      const newFilled = { ...filledColors, [`${currentDrawing}-${pathId}`]: selectedColor };
      const allFilled = drawing.paths.every(p => newFilled[`${currentDrawing}-${p.id}`]);
      if (allFilled) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    }
  };

  const clearDrawing = () => {
    saveToHistory();
    const keysToRemove = Object.keys(filledColors).filter(k => k.startsWith(`${currentDrawing}-`));
    const newColors = { ...filledColors };
    keysToRemove.forEach(k => delete newColors[k]);
    setFilledColors(newColors);
    setLayers(layers.map(l => ({ ...l, paths: [] })));
  };

  const deleteSelected = () => {
    // Delete selected elements
    saveToHistory();
    setSelectedElements([]);
  };

  const selectAll = () => {
    // Select all elements in current layer
    const layer = getActiveLayer();
    if (layer) {
      setSelectedElements(layer.paths.map(p => p.id));
    }
  };

  // ============ EXPORT FUNCTIONS ============

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
        a.download = `artwork-${drawings[currentDrawing].name.toLowerCase()}-${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsSaving(false);
        return;
      }

      const svgUrl = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        const scale = quality === 1 ? 2 : quality === 0.5 ? 1 : 4;
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
          a.download = `artwork-${drawings[currentDrawing].name.toLowerCase()}-${Date.now()}.${format}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          URL.revokeObjectURL(svgUrl);
          setIsSaving(false);
        }, format === 'jpg' ? 'image/jpeg' : 'image/png', format === 'jpg' ? 0.9 : undefined);
      };

      img.onerror = () => setIsSaving(false);
      img.src = svgUrl;
    } catch (error) {
      setIsSaving(false);
    }

    setShowExportModal(false);
  };

  // ============ COLOR FUNCTIONS ============

  const handleHexChange = (hex) => {
    setHexInput(hex);
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      setSelectedColor(hex);
    }
  };

  // ============ RENDER ============

  const drawing = drawings[currentDrawing];
  const canvasWidth = Math.min(windowSize.width - (windowSize.width > 768 ? 400 : 32), 900);
  const canvasHeight = canvasWidth * (300 / 420);

  const themeClasses = darkMode
    ? 'bg-gray-900 text-white'
    : 'bg-gradient-to-br from-purple-50 to-pink-50';

  return (
    <div className={`h-screen flex overflow-hidden select-none ${themeClasses}`}>
      {/* Left Toolbar - Figma Style */}
      <div className={`w-12 flex flex-col items-center py-2 gap-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg z-20`}>
        {/* Tool buttons */}
        {[
          { id: 'select', icon: '↖️', label: 'Select (V)', key: 'V' },
          { id: 'brush', icon: '🖌️', label: 'Brush (B)', key: 'B' },
          { id: 'eraser', icon: '🧽', label: 'Eraser (E)', key: 'E' },
          { id: 'fill', icon: '🪣', label: 'Fill (G)', key: 'G' },
          { id: 'shape', icon: '⬜', label: 'Shape (R)', key: 'R' },
          { id: 'eyedropper', icon: '💉', label: 'Eyedropper (I)', key: 'I' },
        ].map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
              activeTool === tool.id
                ? 'bg-purple-500 text-white shadow-md'
                : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}

        <div className={`w-8 h-px my-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />

        {/* Symmetry */}
        <button
          onClick={() => setActivePanel(activePanel === 'symmetry' ? null : 'symmetry')}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
            symmetryMode.id !== 'none'
              ? 'bg-blue-500 text-white'
              : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
          title="Symmetry (M)"
        >
          {symmetryMode.icon}
        </button>

        <div className="flex-1" />

        {/* Bottom actions */}
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
            showGrid ? 'bg-green-500 text-white' : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
          title="Toggle Grid"
        >
          #
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
          title="Toggle Theme"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Secondary toolbar for active tool */}
      {(activeTool === 'brush' || activeTool === 'eraser') && (
        <div className={`w-48 py-2 px-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col gap-2 overflow-y-auto`}>
          <div className="text-xs font-medium text-gray-500 px-1">Brush Type</div>
          <div className="grid grid-cols-4 gap-1">
            {brushTypes.map(brush => (
              <button
                key={brush.id}
                onClick={() => setBrushType(brush)}
                className={`p-1.5 rounded text-lg ${
                  brushType.id === brush.id
                    ? 'bg-purple-500 text-white'
                    : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title={brush.name}
              >
                {brush.icon}
              </button>
            ))}
          </div>

          <div className="text-xs font-medium text-gray-500 px-1 mt-2">Size: {brushSize}px</div>
          <input
            type="range"
            min="1"
            max="100"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full accent-purple-500"
          />

          <div className="text-xs font-medium text-gray-500 px-1 mt-2">Opacity: {Math.round(colorOpacity * 100)}%</div>
          <input
            type="range"
            min="0"
            max="100"
            value={colorOpacity * 100}
            onChange={(e) => setColorOpacity(e.target.value / 100)}
            className="w-full accent-purple-500"
          />
        </div>
      )}

      {activeTool === 'shape' && (
        <div className={`w-48 py-2 px-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col gap-2`}>
          <div className="text-xs font-medium text-gray-500 px-1">Shape Type</div>
          <div className="grid grid-cols-4 gap-1">
            {shapeTools.map(shape => (
              <button
                key={shape.id}
                onClick={() => setShapeType(shape)}
                className={`p-1.5 rounded text-lg ${
                  shapeType.id === shape.id
                    ? 'bg-purple-500 text-white'
                    : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title={shape.name}
              >
                {shape.icon}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm mt-2">
            <input
              type="checkbox"
              checked={shapeFill}
              onChange={(e) => setShapeFill(e.target.checked)}
              className="accent-purple-500"
            />
            Fill Shape
          </label>

          <div className="text-xs font-medium text-gray-500 px-1 mt-2">Stroke: {brushSize}px</div>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>
      )}

      {/* Symmetry Panel */}
      {activePanel === 'symmetry' && (
        <div className={`w-48 py-2 px-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col gap-2`}>
          <div className="text-xs font-medium text-gray-500 px-1">Symmetry Mode</div>
          {symmetryModes.map(mode => (
            <button
              key={mode.id}
              onClick={() => { setSymmetryMode(mode); setActivePanel(null); }}
              className={`p-2 rounded text-left flex items-center gap-2 ${
                symmetryMode.id === mode.id
                  ? 'bg-purple-500 text-white'
                  : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{mode.icon}</span>
              <span className="text-sm">{mode.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className={`flex items-center justify-between px-3 py-1.5 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm z-10`}>
          <div className="flex items-center gap-2">
            {/* File menu */}
            <div className="relative">
              <button
                onClick={() => setActivePanel(activePanel === 'file' ? null : 'file')}
                className={`px-3 py-1 rounded text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                File
              </button>
              {activePanel === 'file' && (
                <div className={`absolute top-full left-0 mt-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} py-1 min-w-[160px] z-50`}>
                  <button onClick={() => { saveArtwork('png'); setActivePanel(null); }} className={`w-full px-3 py-1.5 text-left text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    💾 Save PNG <span className="text-gray-400 text-xs ml-2">⌘S</span>
                  </button>
                  <button onClick={() => { setShowExportModal(true); setActivePanel(null); }} className={`w-full px-3 py-1.5 text-left text-sm ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    📤 Export... <span className="text-gray-400 text-xs ml-2">⌘E</span>
                  </button>
                  <div className={`h-px my-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                  <button onClick={() => { clearDrawing(); setActivePanel(null); }} className={`w-full px-3 py-1.5 text-left text-sm text-red-500 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    🗑️ Clear Canvas
                  </button>
                </div>
              )}
            </div>

            {/* Pictures menu */}
            <div className="relative">
              <button
                onClick={() => setActivePanel(activePanel === 'pictures' ? null : 'pictures')}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                {drawing.icon} {drawing.name}
              </button>
              {activePanel === 'pictures' && (
                <div className={`absolute top-full left-0 mt-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-2 z-50`}>
                  <div className="grid grid-cols-3 gap-1">
                    {drawings.map((d, i) => (
                      <button
                        key={d.name}
                        onClick={() => { setCurrentDrawing(i); setActivePanel(null); }}
                        className={`p-2 rounded-lg text-center transition-all ${
                          currentDrawing === i
                            ? 'bg-purple-500 text-white'
                            : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="text-xl">{d.icon}</div>
                        <div className="text-xs">{d.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Music */}
            <button
              onClick={() => setActivePanel(activePanel === 'music' ? null : 'music')}
              className={`px-2 py-1 rounded text-sm ${isPlaying ? 'bg-green-500 text-white' : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {isPlaying ? '🎵' : '🎶'}
            </button>
            {activePanel === 'music' && (
              <div className={`absolute top-12 left-1/4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-3 z-50`}>
                <div className="grid grid-cols-3 gap-2">
                  {musicTracks.map((track) => (
                    <button
                      key={track.name}
                      onClick={() => isPlaying && currentTrack?.name === track.name ? stopMusic() : playTrack(track)}
                      className={`p-2 rounded-lg text-center transition-all ${
                        currentTrack?.name === track.name
                          ? 'bg-green-500 text-white'
                          : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-xl">{track.emoji}</div>
                      <div className="text-xs">{track.name}</div>
                    </button>
                  ))}
                </div>
                {isPlaying && (
                  <button
                    onClick={stopMusic}
                    className="mt-2 w-full py-1.5 bg-red-500 text-white rounded-lg text-sm"
                  >
                    ⏹️ Stop
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className={`p-1.5 rounded ${historyIndex > 0 ? 'hover:bg-gray-200' : 'opacity-40'} ${darkMode ? 'hover:bg-gray-700' : ''}`}
              title="Undo (⌘Z)"
            >
              ↩️
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className={`p-1.5 rounded ${historyIndex < history.length - 1 ? 'hover:bg-gray-200' : 'opacity-40'} ${darkMode ? 'hover:bg-gray-700' : ''}`}
              title="Redo (⌘Y)"
            >
              ↪️
            </button>

            <div className={`w-px h-5 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

            {/* Zoom controls */}
            <button onClick={() => setZoom(z => Math.max(0.25, z - 0.25))} className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>−</button>
            <span className="text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(4, z + 0.25))} className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>+</button>
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className={`p-1 rounded text-xs ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>Fit</button>
          </div>
        </div>

        {/* Canvas Container */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center p-4 overflow-hidden"
          style={{ cursor: isPanning ? 'grab' : activeTool === 'brush' ? 'crosshair' : 'default' }}
          onClick={() => activePanel && !['file', 'pictures', 'music'].includes(activePanel) && setActivePanel(null)}
        >
          <div
            className="relative rounded-xl shadow-2xl overflow-hidden"
            style={{
              width: canvasWidth * zoom,
              height: canvasHeight * zoom,
              transform: `translate(${pan.x * zoom}px, ${pan.y * zoom}px)`,
            }}
          >
            {showCelebration && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                <div className="text-center animate-bounce">
                  <div className="text-5xl mb-1">🌟</div>
                  <p className="text-xl text-purple-500 font-bold">Beautiful!</p>
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
              {/* Grid overlay */}
              {showGrid && (
                <g opacity="0.3">
                  {Array.from({ length: Math.ceil(420 / gridSize) }).map((_, i) => (
                    <line key={`v${i}`} x1={i * gridSize} y1="0" x2={i * gridSize} y2="300" stroke="#ccc" strokeWidth="0.5" />
                  ))}
                  {Array.from({ length: Math.ceil(300 / gridSize) }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * gridSize} x2="420" y2={i * gridSize} stroke="#ccc" strokeWidth="0.5" />
                  ))}
                </g>
              )}

              {/* Symmetry guides */}
              {symmetryMode.id !== 'none' && (
                <g opacity="0.2" strokeDasharray="4,4">
                  {(symmetryMode.id === 'horizontal' || symmetryMode.id === 'quad') && (
                    <line x1="210" y1="0" x2="210" y2="300" stroke="#9333ea" strokeWidth="1" />
                  )}
                  {(symmetryMode.id === 'vertical' || symmetryMode.id === 'quad') && (
                    <line x1="0" y1="150" x2="420" y2="150" stroke="#9333ea" strokeWidth="1" />
                  )}
                  {symmetryMode.id === 'radial' && (
                    <>
                      {Array.from({ length: symmetryMode.spokes }).map((_, i) => {
                        const angle = (2 * Math.PI * i) / symmetryMode.spokes;
                        return (
                          <line
                            key={i}
                            x1="210"
                            y1="150"
                            x2={210 + 200 * Math.cos(angle)}
                            y2={150 + 200 * Math.sin(angle)}
                            stroke="#9333ea"
                            strokeWidth="1"
                          />
                        );
                      })}
                    </>
                  )}
                </g>
              )}

              {/* Layer paths */}
              {layers.filter(l => l.visible).map(layer => (
                <g key={layer.id} opacity={layer.opacity}>
                  {layer.paths.map((path, i) => {
                    if (path.isShape) {
                      return (
                        <path
                          key={path.id || i}
                          d={shapeToPath(path)}
                          fill={path.fill ? path.color : 'none'}
                          stroke={path.color}
                          strokeWidth={path.strokeWidth}
                          opacity={path.opacity}
                        />
                      );
                    }
                    return (
                      <path
                        key={path.id || i}
                        d={pointsToPath(path.points)}
                        stroke={path.color}
                        strokeWidth={path.size}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        opacity={path.opacity}
                        style={{ filter: path.brushType?.softness > 0 ? `blur(${path.brushType.softness}px)` : 'none' }}
                      />
                    );
                  })}
                </g>
              ))}

              {/* Current drawing path */}
              {currentPath && currentPath.points.length > 1 && (
                <path
                  d={pointsToPath(currentPath.points)}
                  stroke={currentPath.color}
                  strokeWidth={currentPath.size}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={currentPath.opacity}
                />
              )}

              {/* Current shape preview */}
              {currentShape && (
                <path
                  d={shapeToPath(currentShape)}
                  fill={currentShape.fill ? currentShape.color : 'none'}
                  stroke={currentShape.color}
                  strokeWidth={currentShape.strokeWidth}
                  opacity={currentShape.opacity * 0.7}
                  strokeDasharray="4,4"
                />
              )}

              {/* Pre-made drawing paths */}
              {drawing.paths.map((path) => {
                const fillColor = filledColors[`${currentDrawing}-${path.id}`] || 'transparent';
                const isStroke = path.id.includes('antenna') || (path.id.includes('tail') && drawing.name === 'Cat');

                return (
                  <path
                    key={path.id}
                    d={path.d}
                    fill={isStroke ? 'none' : fillColor}
                    stroke={isStroke ? (filledColors[`${currentDrawing}-${path.id}`] || '#D1D5DB') : '#9CA3AF'}
                    strokeWidth={isStroke ? 4 : 2}
                    strokeLinecap="round"
                    className="transition-colors duration-200"
                    onClick={() => handlePathClick(path.id)}
                    style={{
                      cursor: activeTool === 'fill' ? 'pointer' : 'default',
                      pointerEvents: activeTool === 'fill' ? 'auto' : 'none'
                    }}
                  />
                );
              })}

              {/* Selection box */}
              {selectionBox && (
                <rect
                  x={Math.min(selectionBox.startX, selectionBox.endX)}
                  y={Math.min(selectionBox.startY, selectionBox.endY)}
                  width={Math.abs(selectionBox.endX - selectionBox.startX)}
                  height={Math.abs(selectionBox.endY - selectionBox.startY)}
                  fill="rgba(147, 51, 234, 0.1)"
                  stroke="#9333ea"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              )}
            </svg>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className={`flex items-center justify-between px-3 py-1 text-xs ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
          <div className="flex items-center gap-3">
            <span>{drawing.icon} {drawing.name}</span>
            <span>|</span>
            <span>Layer: {getActiveLayer()?.name}</span>
            {symmetryMode.id !== 'none' && <span className="text-purple-500">Symmetry: {symmetryMode.name}</span>}
          </div>
          <div className="flex items-center gap-3">
            <span>{Math.round(zoom * 100)}%</span>
            {history.length > 0 && <span>History: {historyIndex + 1}/{history.length}</span>}
          </div>
        </div>
      </div>

      {/* Right Panel - Layers & Colors */}
      <div className={`w-64 flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l shadow-lg z-10 hidden md:flex`}>
        {/* Color Section */}
        <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="text-xs font-medium text-gray-500 mb-2">Color</div>

          {/* Current color + hex */}
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-inner"
              style={{ backgroundColor: selectedColor, opacity: colorOpacity }}
            />
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexChange(e.target.value)}
              className={`flex-1 px-2 py-1 text-sm rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
              placeholder="#FFFFFF"
            />
          </div>

          {/* Palette selector */}
          <div className="flex gap-1 mb-2 flex-wrap">
            {Object.keys(colorPalettes).map((palette) => (
              <button
                key={palette}
                onClick={() => {
                  setCurrentPalette(palette);
                  setSelectedColor(colorPalettes[palette][0]);
                  setHexInput(colorPalettes[palette][0]);
                }}
                className={`px-2 py-0.5 rounded text-xs capitalize ${
                  currentPalette === palette
                    ? 'bg-purple-500 text-white'
                    : darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                {palette}
              </button>
            ))}
          </div>

          {/* Color swatches */}
          <div className="grid grid-cols-8 gap-1">
            {colorPalettes[currentPalette].map((color) => (
              <button
                key={color}
                onClick={() => { setSelectedColor(color); setHexInput(color); }}
                className={`w-6 h-6 rounded-md transition-all ${
                  selectedColor === color ? 'ring-2 ring-purple-500 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Recent colors */}
          {recentColors.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-gray-400 mb-1">Recent</div>
              <div className="flex gap-1">
                {recentColors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedColor(color); setHexInput(color); }}
                    className="w-5 h-5 rounded border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Background colors */}
        <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="text-xs font-medium text-gray-500 mb-2">Background</div>
          <div className="grid grid-cols-6 gap-1">
            {backgroundColors.map((color) => (
              <button
                key={color}
                onClick={() => setBackgroundColor(color)}
                className={`w-6 h-6 rounded-md border transition-all ${
                  backgroundColor === color
                    ? 'ring-2 ring-purple-500'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Layers Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className={`flex items-center justify-between p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <span className="text-xs font-medium text-gray-500">Layers</span>
            <div className="flex gap-1">
              <button onClick={addLayer} className="p-1 rounded hover:bg-gray-200 text-sm" title="Add Layer">➕</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {[...layers].reverse().map((layer, idx) => (
              <div
                key={layer.id}
                onClick={() => setActiveLayerId(layer.id)}
                className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer border-b ${
                  activeLayerId === layer.id
                    ? 'bg-purple-100 dark:bg-purple-900/30'
                    : darkMode ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-100'
                }`}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); }}
                  className={`text-sm ${layer.visible ? '' : 'opacity-30'}`}
                >
                  {layer.visible ? '👁️' : '👁️‍🗨️'}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id); }}
                  className="text-sm"
                >
                  {layer.locked ? '🔒' : '🔓'}
                </button>
                <span className={`flex-1 text-sm truncate ${!layer.visible ? 'opacity-50' : ''}`}>
                  {layer.name}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); duplicateLayer(layer.id); }}
                    className="text-xs p-0.5 hover:bg-gray-200 rounded"
                    title="Duplicate"
                  >
                    📋
                  </button>
                  {layers.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }}
                      className="text-xs p-0.5 hover:bg-red-100 rounded text-red-500"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Layer properties */}
          {getActiveLayer() && (
            <div className={`p-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="text-xs text-gray-500 mb-1">Layer Opacity</div>
              <input
                type="range"
                min="0"
                max="100"
                value={getActiveLayer().opacity * 100}
                onChange={(e) => setLayerOpacity(activeLayerId, e.target.value / 100)}
                className="w-full accent-purple-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowExportModal(false)}>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl`} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Export Artwork</h3>

            <div className="mb-4">
              <label className="text-sm text-gray-500 block mb-1">Format</label>
              <div className="flex gap-2">
                {['png', 'jpg', 'svg'].map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setExportFormat(fmt)}
                    className={`px-4 py-2 rounded-lg uppercase text-sm ${
                      exportFormat === fmt
                        ? 'bg-purple-500 text-white'
                        : darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {exportFormat !== 'svg' && (
              <div className="mb-4">
                <label className="text-sm text-gray-500 block mb-1">Quality</label>
                <div className="flex gap-2">
                  {[
                    { value: 0.5, label: 'Low' },
                    { value: 1, label: 'Medium' },
                    { value: 2, label: 'High' },
                  ].map(q => (
                    <button
                      key={q.value}
                      onClick={() => setExportQuality(q.value)}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        exportQuality === q.value
                          ? 'bg-purple-500 text-white'
                          : darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className={`flex-1 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              >
                Cancel
              </button>
              <button
                onClick={() => saveArtwork(exportFormat, exportQuality)}
                disabled={isSaving}
                className="flex-1 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50"
              >
                {isSaving ? 'Exporting...' : 'Export'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Music indicator */}
      {isPlaying && (
        <div className={`fixed bottom-4 right-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-full px-4 py-2 shadow-lg flex items-center gap-2 z-30`}>
          <span className="animate-pulse">{currentTrack?.emoji}</span>
          <span className="text-sm">{currentTrack?.name}</span>
          <button onClick={stopMusic} className="text-red-500 hover:text-red-600">⏹️</button>
        </div>
      )}

      {/* Click outside to close panels */}
      {activePanel && (
        <div className="fixed inset-0 z-40" onClick={() => setActivePanel(null)} />
      )}
    </div>
  );
}
