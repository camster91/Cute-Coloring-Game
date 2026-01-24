import React, { useState, useRef, useEffect, useCallback } from 'react';

// Import modular components
import { TabPanel, BottomSheet } from './ui';
import { ToolsPanel, ColorsPanel, CanvasPanel, LayersPanel, WellnessPanel, MoodTracker, GradientEditor } from './panels';
import { StatusBar } from './toolbar';
import { GridOverlay, LazyBrushIndicator, FloatingToolbar } from './canvas';
import { useTouchGestures, useMusic, useAmbientSounds, hexToHSL, hslToHex, generateColorHarmony } from './hooks';
import useMoodTracking, { moodOptions, activityTags } from './hooks/useMoodTracking';
import useGradientState, { presetGradients, gradientTypes } from './hooks/useGradientState';

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

// Font families for text tool
const fontFamilies = [
  { id: 'sans', name: 'Sans Serif', value: 'system-ui, sans-serif' },
  { id: 'serif', name: 'Serif', value: 'Georgia, serif' },
  { id: 'mono', name: 'Monospace', value: 'Consolas, monospace' },
  { id: 'cursive', name: 'Cursive', value: 'Brush Script MT, cursive' },
  { id: 'comic', name: 'Comic', value: 'Comic Sans MS, cursive' },
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

// Daily drawing prompts for inspiration
const dailyPrompts = [
  // Emotion & Abstract
  { text: "Draw how you feel right now", category: "emotion", icon: "💭" },
  { text: "Visualize your dreams from last night", category: "abstract", icon: "🌙" },
  { text: "What does peace look like to you?", category: "emotion", icon: "☮️" },
  { text: "Draw your happy place", category: "memory", icon: "😊" },
  { text: "Illustrate a song you love", category: "abstract", icon: "🎵" },
  { text: "What color is your mood today?", category: "emotion", icon: "🎨" },
  { text: "Draw energy and movement", category: "abstract", icon: "⚡" },
  { text: "Visualize calm waters", category: "mindful", icon: "🌊" },
  { text: "Create patterns that soothe you", category: "mindful", icon: "🔮" },
  { text: "Draw what gratitude feels like", category: "emotion", icon: "🙏" },
  // Nature
  { text: "A tree in different seasons", category: "nature", icon: "🌳" },
  { text: "Your favorite flower in detail", category: "nature", icon: "🌸" },
  { text: "A sunset you remember", category: "nature", icon: "🌅" },
  { text: "Mountains touching clouds", category: "nature", icon: "🏔️" },
  { text: "Ocean waves crashing", category: "nature", icon: "🌊" },
  { text: "A garden at midnight", category: "nature", icon: "🌙" },
  { text: "Rain on a window", category: "nature", icon: "🌧️" },
  { text: "Autumn leaves falling", category: "nature", icon: "🍂" },
  { text: "A bird in flight", category: "nature", icon: "🦅" },
  { text: "Moonlight on water", category: "nature", icon: "🌕" },
  // Memory & Personal
  { text: "Your childhood bedroom", category: "memory", icon: "🛏️" },
  { text: "A meal that brings comfort", category: "memory", icon: "🍲" },
  { text: "Someone who inspires you", category: "memory", icon: "✨" },
  { text: "A place you want to visit", category: "memory", icon: "✈️" },
  { text: "Your morning routine", category: "memory", icon: "☀️" },
  { text: "A gift you treasure", category: "memory", icon: "🎁" },
  { text: "Your favorite season", category: "memory", icon: "🗓️" },
  { text: "A book that changed you", category: "memory", icon: "📚" },
  // Challenge
  { text: "Draw using only circles", category: "challenge", icon: "⭕" },
  { text: "Create with just 3 colors", category: "challenge", icon: "🎨" },
  { text: "Draw without lifting your pen", category: "challenge", icon: "✏️" },
  { text: "Fill the page with tiny patterns", category: "challenge", icon: "🔲" },
  { text: "Draw the same thing 9 ways", category: "challenge", icon: "9️⃣" },
  { text: "Use only straight lines", category: "challenge", icon: "📏" },
  { text: "Create a symmetrical design", category: "challenge", icon: "🔄" },
  { text: "Draw with your non-dominant hand", category: "challenge", icon: "🤚" },
  // Mindful
  { text: "Slow, deliberate spiral", category: "mindful", icon: "🌀" },
  { text: "Meditative repeated shapes", category: "mindful", icon: "🔷" },
  { text: "Breath-synchronized strokes", category: "mindful", icon: "🫁" },
  { text: "Zentangle-inspired patterns", category: "mindful", icon: "✴️" },
  { text: "Mandala from the center out", category: "mindful", icon: "🔆" },
  { text: "Flowing water-like lines", category: "mindful", icon: "〰️" },
  { text: "Gentle gradients of color", category: "mindful", icon: "🌈" },
  { text: "Repetitive calming marks", category: "mindful", icon: "|||" },
  // Random/Creative
  { text: "A door to another world", category: "creative", icon: "🚪" },
  { text: "What lives in the clouds?", category: "creative", icon: "☁️" },
  { text: "An impossible architecture", category: "creative", icon: "🏛️" },
  { text: "Merge two animals into one", category: "creative", icon: "🦄" },
  { text: "A map of an imaginary place", category: "creative", icon: "🗺️" },
  { text: "Objects with personalities", category: "creative", icon: "🎭" },
  { text: "Time as a visual concept", category: "creative", icon: "⏰" },
  { text: "Music as shapes and colors", category: "creative", icon: "🎼" },
];

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
  const [currentPalette, setCurrentPalette] = useState('soft');
  const [selectedColor, setSelectedColor] = useState(colorPalettes.soft[0]);
  const [colorOpacity, setColorOpacity] = useState(1);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [zoom, setZoom] = useState(() => {
    const saved = localStorage.getItem('calmDrawing_zoom');
    return saved ? parseFloat(saved) : 1;
  });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hasInitializedZoom, setHasInitializedZoom] = useState(false);

  // Tool state
  const [activeTool, setActiveTool] = useState('brush');
  const [brushType, setBrushType] = useState(brushTypes[0]);
  const [brushSize, setBrushSize] = useState(12);
  const [shapeType, setShapeType] = useState(shapeTools[0]);
  const [shapeFill, setShapeFill] = useState(true);
  const [symmetryMode, setSymmetryMode] = useState(symmetryModes[0]);

  // Text tool state
  const [textInput, setTextInput] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState(fontFamilies[0]);
  const [textPosition, setTextPosition] = useState(null);
  const [isEditingText, setIsEditingText] = useState(false);

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
  const [leftSidebarTab, setLeftSidebarTab] = useState('tools');
  const [rightSidebarTab, setRightSidebarTab] = useState('layers');
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

  // Lazy Brush (string/rope mode for precision)
  const [lazyBrushEnabled, setLazyBrushEnabled] = useState(false);
  const [lazyBrushRadius, setLazyBrushRadius] = useState(30); // pixels
  const lazyBrushPosRef = useRef({ x: 0, y: 0 }); // Current brush position
  const [lazyBrushIndicator, setLazyBrushIndicator] = useState(null); // Visual indicator

  // Palm rejection (prioritize pen input, reject large touch areas)
  const [palmRejection, setPalmRejection] = useState(true);

  // Brush cursor preview
  const [cursorPosition, setCursorPosition] = useState(null);

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

  // Daily Prompts
  const [showDailyPrompt, setShowDailyPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(() => {
    // Get daily prompt based on date
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    return dailyPrompts[dayOfYear % dailyPrompts.length];
  });
  const [promptDismissed, setPromptDismissed] = useState(false);

  // History (undo/redo)
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistory = 50;

  // Export
  const [isSaving, setIsSaving] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('png');
  const [exportQuality, setExportQuality] = useState(2);
  const [exportTransparent, setExportTransparent] = useState(false);

  // Window size and responsive breakpoints
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const isMobile = windowSize.width < 640;
  const isTablet = windowSize.width >= 640 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { isPlaying, currentTrack, playTrack, stopMusic } = useMusic();
  const { startSound, stopSound, setVolume: setAmbientVolume, stopAllSounds } = useAmbientSounds();

  // Mood tracking hook
  const {
    currentMood,
    moodNote,
    setMoodNote,
    selectedActivities,
    toggleActivity,
    showMoodPrompt,
    dismissMoodPrompt,
    showMoodHistory,
    setShowMoodHistory,
    groupedHistory,
    recordMood,
    deleteMoodEntry,
    clearMoodHistory,
    moodStats,
    moodTrend,
  } = useMoodTracking();

  // Gradient editor hook
  const {
    gradientEnabled,
    setGradientEnabled,
    gradientType,
    setGradientType,
    gradientAngle,
    setGradientAngle,
    gradientColors,
    gradientCSS,
    addColorStop,
    removeColorStop,
    updateColorStop,
    customGradients,
    loadPreset,
    saveCustomGradient,
    deleteCustomGradient,
    loadCustomGradient,
    reverseGradient,
    rotateGradient,
    radialPosition,
    setRadialPosition,
  } = useGradientState();

  // Touch gestures for mobile (pinch-to-zoom, two-finger pan, tap gestures)
  // Note: undo/redo are defined later but work due to closure over refs
  const undoRef = useRef(null);
  const redoRef = useRef(null);

  useTouchGestures({
    targetRef: containerRef,
    onZoom: (delta) => {
      setZoom(z => Math.max(0.25, Math.min(4, z + delta)));
    },
    onPan: (delta) => {
      setPan(p => ({ x: p.x + delta.x, y: p.y + delta.y }));
    },
    onUndo: () => undoRef.current?.(),
    onRedo: () => redoRef.current?.(),
  });

  // ============ EFFECTS ============

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // QW2: Save zoom to localStorage when it changes
  useEffect(() => {
    if (hasInitializedZoom) {
      localStorage.setItem('calmDrawing_zoom', zoom.toString());
    }
  }, [zoom, hasInitializedZoom]);

  // QW4: Calculate and set optimal zoom on first load
  useEffect(() => {
    if (hasInitializedZoom) return;

    // Only auto-fit if no saved zoom preference
    const savedZoom = localStorage.getItem('calmDrawing_zoom');
    if (savedZoom) {
      setHasInitializedZoom(true);
      return;
    }

    // Calculate optimal zoom to fit canvas
    const sidebarW = window.innerWidth < 768 ? 0 : (focusMode ? 0 : 224 * 2);
    const headerH = focusMode ? 0 : 52;
    const statusH = focusMode ? 0 : 28;
    const pad = window.innerWidth < 768 ? 8 : 16;

    const availW = window.innerWidth - sidebarW - pad * 2;
    const availH = window.innerHeight - headerH - statusH - pad * 2;

    const baseWidth = 420;
    const baseHeight = 300;

    // Calculate zoom to fit with some margin (90% of available space)
    const zoomToFitW = (availW * 0.9) / baseWidth;
    const zoomToFitH = (availH * 0.9) / baseHeight;
    const optimalZoom = Math.min(zoomToFitW, zoomToFitH, 2); // Cap at 2x

    setZoom(Math.max(0.5, Math.round(optimalZoom * 4) / 4)); // Round to nearest 0.25
    setHasInitializedZoom(true);
  }, [focusMode, hasInitializedZoom]);

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

  // Ambient sounds management
  const prevSoundsRef = useRef({});
  useEffect(() => {
    const prevSounds = prevSoundsRef.current;

    // Start new sounds
    Object.entries(activeSounds).forEach(([id, volume]) => {
      if (prevSounds[id] === undefined) {
        startSound(id, volume);
      } else if (prevSounds[id] !== volume) {
        setAmbientVolume(id, volume);
      }
    });

    // Stop removed sounds
    Object.keys(prevSounds).forEach(id => {
      if (activeSounds[id] === undefined) {
        stopSound(id);
      }
    });

    prevSoundsRef.current = { ...activeSounds };
  }, [activeSounds, startSound, stopSound, setAmbientVolume]);

  // Cleanup ambient sounds on unmount
  useEffect(() => {
    return () => stopAllSounds();
  }, [stopAllSounds]);

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
        case 'i': setActiveTool('eyedropper'); break;
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
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(state);
      if (newHistory.length > maxHistory) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, maxHistory - 1));
  }, [layers, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setLayers(prevState.layers);
      setHistoryIndex(i => i - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setLayers(nextState.layers);
      setHistoryIndex(i => i + 1);
    }
  }, [history, historyIndex]);

  // Update refs for touch gesture callbacks
  useEffect(() => {
    undoRef.current = undo;
    redoRef.current = redo;
  }, [undo, redo]);

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
    if (!svg) return { x: 0, y: 0, pressure: 0.5, tiltX: 0, tiltY: 0 };

    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let x = ((clientX - rect.left) / rect.width) * 420;
    let y = ((clientY - rect.top) / rect.height) * 300;

    if (snapToGrid) {
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }

    // Extract stylus pressure and tilt from Pointer Events API
    // pressure: 0-1 range (0.5 default for mouse, varies for stylus)
    // tiltX/tiltY: -90 to 90 degrees
    const pressure = e.pressure !== undefined ? e.pressure : 0.5;
    const tiltX = e.tiltX || 0;
    const tiltY = e.tiltY || 0;

    return { x, y, pressure, tiltX, tiltY };
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

    // Palm rejection: prioritize pen, reject large touch contact areas
    if (palmRejection && e.pointerType === 'touch') {
      // Reject if touch area is too large (likely palm)
      const touchSize = Math.max(e.width || 0, e.height || 0);
      if (touchSize > 40) return; // Large contact = palm
    }

    const pos = getPointerPosition(e);
    const layer = getActiveLayer();

    if (layer?.locked && activeTool !== 'fill') return;

    if (activeTool === 'brush' || activeTool === 'eraser') {
      e.preventDefault();
      saveToHistory();
      setIsDrawing(true);
      lastPointRef.current = pos;
      lastTimeRef.current = Date.now();

      // Initialize lazy brush position
      if (lazyBrushEnabled) {
        lazyBrushPosRef.current = { ...pos };
        setLazyBrushIndicator({ cursor: pos, brush: pos });
      }

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
    } else if (activeTool === 'text') {
      // Text tool: set position for text input
      e.preventDefault();
      setTextPosition(pos);
      setIsEditingText(true);
      setTextInput('');
    } else if (activeTool === 'eyedropper') {
      // Pick color from canvas using pixel sampling
      e.preventDefault();
      const svg = canvasRef.current;
      if (!svg) return;

      // Get the element at the click position
      const element = document.elementFromPoint(
        e.touches ? e.touches[0].clientX : e.clientX,
        e.touches ? e.touches[0].clientY : e.clientY
      );

      if (element && element.tagName === 'path') {
        const fill = element.getAttribute('fill');
        const stroke = element.getAttribute('stroke');
        const color = fill && fill !== 'none' && fill !== 'transparent' ? fill : stroke;
        if (color && color !== 'none') {
          setSelectedColor(color);
          setHexInput(color);
          // Add to recent colors
          setRecentColors(prev => {
            const filtered = prev.filter(c => c !== color);
            return [color, ...filtered].slice(0, 10);
          });
          // Switch back to brush after picking
          setActiveTool('brush');
        }
      } else {
        // If clicked on background, pick background color
        setSelectedColor(backgroundColor);
        setHexInput(backgroundColor);
        setActiveTool('brush');
      }
    }
  }, [isPanning, palmRejection, getPointerPosition, getActiveLayer, activeTool, saveToHistory, generateSymmetricPoints, symmetryMode, backgroundColor, selectedColor, brushSize, brushType, colorOpacity, shapeType, shapeFill, setSelectedColor, setHexInput, setRecentColors]);

  const handlePointerMove = useCallback((e) => {
    // Always track cursor position for brush preview
    const pos = getPointerPosition(e);
    setCursorPosition(pos);

    if (isPanning && e.buttons === 1) {
      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;
      setPan(p => ({ x: p.x + movementX / zoom, y: p.y + movementY / zoom }));
      return;
    }

    if (!isDrawing) return;

    if ((activeTool === 'brush' || activeTool === 'eraser') && currentPath) {
      e.preventDefault();

      // Calculate actual drawing position (lazy brush or direct)
      let drawPos = pos;

      if (lazyBrushEnabled) {
        const lazyPos = lazyBrushPosRef.current;
        const dx = pos.x - lazyPos.x;
        const dy = pos.y - lazyPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only move brush if cursor is outside the lazy radius
        if (distance > lazyBrushRadius) {
          // Calculate how far to move toward cursor
          const moveDistance = distance - lazyBrushRadius;
          const angle = Math.atan2(dy, dx);
          drawPos = {
            x: lazyPos.x + Math.cos(angle) * moveDistance,
            y: lazyPos.y + Math.sin(angle) * moveDistance
          };
          lazyBrushPosRef.current = drawPos;
        } else {
          // Cursor within radius, don't move brush
          setLazyBrushIndicator({ cursor: pos, brush: lazyPos });
          return;
        }

        // Update indicator
        setLazyBrushIndicator({ cursor: pos, brush: drawPos });
      }

      // Calculate pressure-based and speed-based size variation
      const now = Date.now();
      const timeDelta = now - lastTimeRef.current;
      const lastPos = lastPointRef.current;

      if (lastPos && timeDelta > 0) {
        const distance = Math.sqrt(Math.pow(drawPos.x - lastPos.x, 2) + Math.pow(drawPos.y - lastPos.y, 2));
        const speed = distance / timeDelta;

        // Speed-based variation (faster = thinner for calligraphy effect)
        const speedFactor = Math.max(brushType.minSize, Math.min(brushType.maxSize, 1 - speed * 0.5));

        // Use real stylus pressure if available (pressure > 0 and not default 0.5)
        // Combine with speed factor for dynamic strokes
        const realPressure = pos.pressure;
        const hasRealPressure = realPressure > 0 && realPressure !== 0.5;

        // Final pressure combines real pressure (if available) with speed variation
        // Real pressure: directly affects stroke width
        // Speed factor: adds calligraphy-like variation
        const finalPressure = hasRealPressure
          ? realPressure * speedFactor  // Real stylus: multiply pressure by speed factor
          : speedFactor;                 // Mouse/touch: use speed factor only

        const symmetricPoints = generateSymmetricPoints(drawPos, symmetryMode);

        setCurrentPath(prev => prev.map((path, i) => ({
          ...path,
          points: [...path.points, {
            ...symmetricPoints[i],
            pressure: finalPressure,
            tiltX: pos.tiltX,
            tiltY: pos.tiltY
          }]
        })));
      }

      lastPointRef.current = drawPos;
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

    // Clear lazy brush indicator
    setLazyBrushIndicator(null);

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

  const clearDrawing = () => {
    saveToHistory();
    setLayers(prev => prev.map(l => ({ ...l, paths: [] })));
  };

  // Confirm text input and add to layer
  const confirmText = useCallback(() => {
    if (!textInput.trim() || !textPosition) {
      setIsEditingText(false);
      setTextPosition(null);
      return;
    }

    saveToHistory();

    const textElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      text: textInput,
      x: textPosition.x,
      y: textPosition.y,
      fontSize,
      fontFamily: fontFamily.value,
      color: selectedColor,
      opacity: colorOpacity,
    };

    setLayers(prev => prev.map(l =>
      l.id === activeLayerId
        ? { ...l, paths: [...l.paths, textElement] }
        : l
    ));

    setIsEditingText(false);
    setTextPosition(null);
    setTextInput('');
  }, [textInput, textPosition, fontSize, fontFamily, selectedColor, colorOpacity, activeLayerId, saveToHistory]);

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

  // ============ VIEW CONTROLS ============

  // QW3: Fit-to-Screen function
  const fitToScreen = useCallback(() => {
    const sidebarW = isMobile ? 0 : (focusMode ? 0 : 224 * 2);
    const headerH = focusMode ? 0 : 52;
    const statusH = focusMode ? 0 : 28;
    const pad = isMobile ? 8 : 16;

    const availW = windowSize.width - sidebarW - pad * 2;
    const availH = windowSize.height - headerH - statusH - pad * 2;

    const baseWidth = 420;
    const baseHeight = 300;

    // Calculate zoom to fit with some margin (95% of available space)
    const zoomToFitW = (availW * 0.95) / baseWidth;
    const zoomToFitH = (availH * 0.95) / baseHeight;
    const optimalZoom = Math.min(zoomToFitW, zoomToFitH, 4); // Cap at 4x

    setZoom(Math.max(0.25, Math.round(optimalZoom * 4) / 4)); // Round to nearest 0.25
    setPan({ x: 0, y: 0 }); // Center the canvas
  }, [isMobile, focusMode, windowSize]);

  // ============ EXPORT ============

  const saveArtwork = async (format = exportFormat, quality = exportQuality, transparent = exportTransparent) => {
    if (!canvasRef.current || isSaving) return;
    setIsSaving(true);

    try {
      const svg = canvasRef.current.cloneNode(true);

      // For transparent export, remove background
      if (transparent && format === 'png') {
        svg.style.backgroundColor = 'transparent';
      }

      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });

      if (format === 'svg') {
        const url = URL.createObjectURL(svgBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `calm-drawing-${Date.now()}.svg`;
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

        // Only fill background if not transparent (or if JPG which doesn't support transparency)
        if (!transparent || format === 'jpg') {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `calm-drawing-${Date.now()}.${format}`;
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

  // Calculate canvas size to fill available space
  // Mobile: no sidebars, Tablet: one sidebar (224px), Desktop: two sidebars (448px)
  const sidebarWidth = isMobile ? 0 : (focusMode ? 0 : (isTablet ? 224 : 224 * 2));
  const headerHeight = focusMode ? 0 : (isMobile ? 44 : 52);
  const statusHeight = focusMode ? 0 : (isMobile ? 0 : 28);
  const padding = isMobile ? 4 : (isTablet ? 8 : 16);

  const availableWidth = windowSize.width - sidebarWidth - padding * 2;
  const availableHeight = windowSize.height - headerHeight - statusHeight - padding * 2;

  // Maintain 420:300 aspect ratio while filling space
  const aspectRatio = 420 / 300;
  let canvasWidth, canvasHeight;

  if (availableWidth / availableHeight > aspectRatio) {
    // Height is limiting factor
    canvasHeight = Math.max(200, availableHeight);
    canvasWidth = canvasHeight * aspectRatio;
  } else {
    // Width is limiting factor
    canvasWidth = Math.max(280, availableWidth);
    canvasHeight = canvasWidth / aspectRatio;
  }

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
      {/* Focus Mode - Zen Drawing Experience */}
      {focusMode && (
        <>
          {/* Minimal floating toolbar - appears on hover at top */}
          <div
            className={`
              fixed top-0 left-0 right-0 z-50
              flex justify-center pt-3
              opacity-0 hover:opacity-100
              transition-all duration-500
            `}
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 100%)' }}
          >
            <div className={`
              ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'}
              backdrop-blur-xl rounded-2xl shadow-2xl
              px-4 py-2.5 flex items-center gap-3
              border ${darkMode ? 'border-white/10' : 'border-gray-200/50'}
            `}>
              {/* Tools */}
              <div className="flex items-center gap-1">
                {[
                  { id: 'brush', icon: '✏️', label: 'Brush' },
                  { id: 'eraser', icon: '🧽', label: 'Eraser' },
                  { id: 'fill', icon: '🪣', label: 'Fill' },
                ].map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`
                      w-9 h-9 rounded-xl flex items-center justify-center text-lg
                      transition-all duration-200
                      ${activeTool === tool.id
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg scale-110'
                        : `${theme.hover}`
                      }
                    `}
                    title={tool.label}
                  >
                    {tool.icon}
                  </button>
                ))}
              </div>

              <div className={`w-px h-6 ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`} />

              {/* Brush Size */}
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="2"
                  max="80"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-20 accent-indigo-500"
                />
                <span className={`text-xs font-medium w-8 ${theme.textMuted}`}>{brushSize}px</span>
              </div>

              <div className={`w-px h-6 ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`} />

              {/* Color */}
              <button
                onClick={() => setActivePanel(activePanel === 'focusColors' ? null : 'focusColors')}
                className="relative group"
              >
                <div
                  className="w-8 h-8 rounded-xl border-2 border-white shadow-lg cursor-pointer
                    transition-transform group-hover:scale-110"
                  style={{ backgroundColor: selectedColor }}
                />
              </button>

              <div className={`w-px h-6 ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`} />

              {/* Undo/Redo */}
              <div className="flex items-center gap-1">
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme.hover} disabled:opacity-30`}
                  title="Undo"
                >
                  ↩
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme.hover} disabled:opacity-30`}
                  title="Redo"
                >
                  ↪
                </button>
              </div>

              <div className={`w-px h-6 ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`} />

              {/* Exit */}
              <button
                onClick={() => setFocusMode(false)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium
                  ${theme.hover} transition-all
                `}
                title="Exit Focus Mode (Esc)"
              >
                Exit
              </button>
            </div>
          </div>

          {/* Focus Mode Color Picker */}
          {activePanel === 'focusColors' && (
            <div className={`
              fixed top-20 left-1/2 transform -translate-x-1/2 z-50
              ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'}
              backdrop-blur-xl rounded-2xl shadow-2xl
              p-4 border ${darkMode ? 'border-white/10' : 'border-gray-200/50'}
            `}>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {colorPalettes[currentPalette].map(color => (
                  <button
                    key={color}
                    onClick={() => { setSelectedColor(color); setHexInput(color); setActivePanel(null); }}
                    className={`
                      w-10 h-10 rounded-xl transition-all
                      hover:scale-110 active:scale-95
                      ${selectedColor === color ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
                    `}
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 4px 12px ${color}40`,
                    }}
                  />
                ))}
              </div>

              {/* Recent colors */}
              {recentColors.length > 0 && (
                <div className={`pt-3 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className={`text-[10px] ${theme.textMuted} mb-2`}>Recent</div>
                  <div className="flex gap-1.5">
                    {recentColors.slice(0, 5).map((color, i) => (
                      <button
                        key={i}
                        onClick={() => { setSelectedColor(color); setHexInput(color); setActivePanel(null); }}
                        className="w-7 h-7 rounded-lg transition-all hover:scale-110"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subtle hint at bottom */}
          <div className={`
            fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40
            text-xs ${theme.textMuted}
            opacity-30 hover:opacity-70 transition-opacity
          `}>
            Press <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 font-mono text-[10px]">Esc</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 font-mono text-[10px]">F</kbd> to exit • Two-finger tap to undo
          </div>
        </>
      )}

      {/* Top Bar - Simplified, clean header */}
      {!focusMode && (
      <div className={`flex items-center justify-between px-3 py-2 ${theme.panel} shadow-sm z-20`}>
        {/* Left: App Logo & Tools */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2">
            <span className="text-xl">🎨</span>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium leading-tight">Calm Drawing</div>
              <div className={`text-[10px] ${theme.textMuted}`}>Free canvas</div>
            </div>
          </div>

          {/* Quick Color Indicator */}
          <div className="hidden md:flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: selectedColor }}
              onClick={() => setLeftSidebarTab('colors')}
              title="Current Color"
            />
            <div className={`text-xs font-mono ${theme.textMuted}`}>{brushSize}px</div>
          </div>
        </div>

        {/* Center: Session info (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <span className="text-sm">⏱️</span>
            <span className="text-sm font-medium tabular-nums">{formatTime(sessionSeconds)}</span>
          </div>
          {(isPlaying || Object.keys(activeSounds).length > 0) && (
            <div className="flex items-center gap-1 text-green-500 animate-pulse">
              <span>🎵</span>
              <span className="text-xs">Playing</span>
            </div>
          )}
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-1">
          {/* Wellness quick toggles */}
          <button
            onClick={() => setActivePanel(activePanel === 'sounds' ? null : 'sounds')}
            className={`
              p-2 rounded-xl transition-all
              ${Object.keys(activeSounds).length > 0 || isPlaying
                ? 'bg-green-500/20 text-green-500'
                : theme.hover
              }
            `}
            title="Ambient Sounds"
          >
            🎶
          </button>
          <button
            onClick={() => setShowBreathing(!showBreathing)}
            className={`p-2 rounded-xl transition-all ${showBreathing ? 'bg-blue-500/20 text-blue-500' : theme.hover}`}
            title="Breathing"
          >
            🫁
          </button>

          <div className={`w-px h-6 mx-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />

          {/* Export & Settings */}
          <button
            onClick={() => setShowExportModal(true)}
            className={`p-2 rounded-xl ${theme.hover} transition-all`}
            title="Export"
          >
            💾
          </button>
          <button
            onClick={() => setFocusMode(true)}
            className={`p-2 rounded-xl ${theme.hover} transition-all`}
            title="Focus Mode (F)"
          >
            🎯
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-xl ${theme.hover} transition-all`}
            title="Toggle Theme"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {isMobile && (
            <button
              onClick={() => setShowMobileTools(!showMobileTools)}
              className={`p-2 rounded-xl ${theme.hover} transition-all`}
            >
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

      {/* Daily Prompt Panel */}
      {showDailyPrompt && (
        <div className="fixed bottom-20 left-4 z-40">
          <div className={`${theme.panel} rounded-2xl shadow-2xl border ${theme.border} p-4 w-72`}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">💡 Today's Prompt</span>
              <button onClick={() => setShowDailyPrompt(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="text-center mb-4">
              <div className="text-3xl mb-2">{currentPrompt.icon}</div>
              <p className={`text-base font-medium ${theme.text}`}>"{currentPrompt.text}"</p>
              <span className={`text-xs ${theme.textMuted} capitalize`}>{currentPrompt.category}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const randomIndex = Math.floor(Math.random() * dailyPrompts.length);
                  setCurrentPrompt(dailyPrompts[randomIndex]);
                }}
                className={`flex-1 py-2 rounded-lg text-sm ${theme.hover} border ${theme.border}`}
              >
                🔄 New Prompt
              </button>
              <button
                onClick={() => { setShowDailyPrompt(false); }}
                className="flex-1 py-2 rounded-lg text-sm bg-purple-500 text-white"
              >
                Start Drawing
              </button>
            </div>

            <div className={`mt-3 pt-3 border-t ${theme.border}`}>
              <div className={`text-xs ${theme.textMuted} mb-2`}>Categories</div>
              <div className="flex flex-wrap gap-1">
                {['emotion', 'nature', 'memory', 'challenge', 'mindful', 'creative'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      const filtered = dailyPrompts.filter(p => p.category === cat);
                      setCurrentPrompt(filtered[Math.floor(Math.random() * filtered.length)]);
                    }}
                    className={`px-2 py-0.5 rounded-full text-xs capitalize ${theme.hover} border ${theme.border}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (tablet/desktop) - hidden in focus mode */}
        {!isMobile && !focusMode && (
          <div className={`w-56 ${theme.panel} border-r ${theme.border} flex flex-col overflow-hidden`}>
            <TabPanel
              tabs={isTablet ? [
                { id: 'tools', icon: '🖌️', label: 'Tools' },
                { id: 'colors', icon: '🎨', label: 'Colors' },
                { id: 'layers', icon: '📑', label: 'Layers' },
                { id: 'canvas', icon: '⚙️', label: 'More' },
              ] : [
                { id: 'tools', icon: '🖌️', label: 'Tools' },
                { id: 'colors', icon: '🎨', label: 'Colors' },
                { id: 'gradient', icon: '🌈', label: 'Gradient' },
                { id: 'canvas', icon: '⚙️', label: 'Canvas' },
              ]}
              activeTab={leftSidebarTab}
              onChange={setLeftSidebarTab}
              darkMode={darkMode}
            >
              {leftSidebarTab === 'tools' && (
                <ToolsPanel
                  activeTool={activeTool}
                  setActiveTool={setActiveTool}
                  brushTypes={brushTypes}
                  brushType={brushType}
                  setBrushType={setBrushType}
                  brushSize={brushSize}
                  setBrushSize={setBrushSize}
                  brushStabilization={brushStabilization}
                  setBrushStabilization={setBrushStabilization}
                  lazyBrushEnabled={lazyBrushEnabled}
                  setLazyBrushEnabled={setLazyBrushEnabled}
                  lazyBrushRadius={lazyBrushRadius}
                  setLazyBrushRadius={setLazyBrushRadius}
                  palmRejection={palmRejection}
                  setPalmRejection={setPalmRejection}
                  fontSize={fontSize}
                  setFontSize={setFontSize}
                  fontFamilies={fontFamilies}
                  fontFamily={fontFamily}
                  setFontFamily={setFontFamily}
                  shapeTools={shapeTools}
                  shapeType={shapeType}
                  setShapeType={setShapeType}
                  shapeFill={shapeFill}
                  setShapeFill={setShapeFill}
                  symmetryModes={symmetryModes}
                  symmetryMode={symmetryMode}
                  setSymmetryMode={setSymmetryMode}
                  darkMode={darkMode}
                />
              )}
              {leftSidebarTab === 'colors' && (
                <ColorsPanel
                  colorPalettes={colorPalettes}
                  currentPalette={currentPalette}
                  setCurrentPalette={setCurrentPalette}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  colorOpacity={colorOpacity}
                  setColorOpacity={setColorOpacity}
                  hexInput={hexInput}
                  setHexInput={setHexInput}
                  onHexChange={handleHexChange}
                  recentColors={recentColors}
                  showColorHarmony={showColorHarmony}
                  setShowColorHarmony={setShowColorHarmony}
                  colorHarmonyTypes={colorHarmonyTypes}
                  selectedHarmony={selectedHarmony}
                  setSelectedHarmony={setSelectedHarmony}
                  harmonyColors={harmonyColors}
                  darkMode={darkMode}
                />
              )}
              {leftSidebarTab === 'gradient' && (
                <GradientEditor
                  gradientEnabled={gradientEnabled}
                  setGradientEnabled={setGradientEnabled}
                  gradientType={gradientType}
                  setGradientType={setGradientType}
                  gradientAngle={gradientAngle}
                  setGradientAngle={setGradientAngle}
                  gradientColors={gradientColors}
                  gradientCSS={gradientCSS}
                  addColorStop={addColorStop}
                  removeColorStop={removeColorStop}
                  updateColorStop={updateColorStop}
                  presetGradients={presetGradients}
                  customGradients={customGradients}
                  loadPreset={loadPreset}
                  saveCustomGradient={saveCustomGradient}
                  deleteCustomGradient={deleteCustomGradient}
                  loadCustomGradient={loadCustomGradient}
                  reverseGradient={reverseGradient}
                  rotateGradient={rotateGradient}
                  gradientTypes={gradientTypes}
                  radialPosition={radialPosition}
                  setRadialPosition={setRadialPosition}
                  darkMode={darkMode}
                />
              )}
              {leftSidebarTab === 'layers' && isTablet && (
                <LayersPanel
                  layers={layers}
                  activeLayerId={activeLayerId}
                  setActiveLayerId={setActiveLayerId}
                  onAddLayer={addLayer}
                  onDeleteLayer={deleteLayer}
                  onToggleVisibility={toggleLayerVisibility}
                  onToggleLock={toggleLayerLock}
                  onLayerOpacity={setLayerOpacity}
                  onMoveLayer={(id, dir) => {
                    const idx = layers.findIndex(l => l.id === id);
                    if (dir === 'up' && idx < layers.length - 1) {
                      const newLayers = [...layers];
                      [newLayers[idx], newLayers[idx + 1]] = [newLayers[idx + 1], newLayers[idx]];
                      setLayers(newLayers);
                    } else if (dir === 'down' && idx > 0) {
                      const newLayers = [...layers];
                      [newLayers[idx], newLayers[idx - 1]] = [newLayers[idx - 1], newLayers[idx]];
                      setLayers(newLayers);
                    }
                  }}
                  onDuplicateLayer={duplicateLayer}
                  onMergeDown={(id) => {
                    const idx = layers.findIndex(l => l.id === id);
                    if (idx > 0) {
                      const newLayers = [...layers];
                      newLayers[idx - 1].paths = [...newLayers[idx - 1].paths, ...newLayers[idx].paths];
                      newLayers.splice(idx, 1);
                      setLayers(newLayers);
                      setActiveLayerId(newLayers[idx - 1].id);
                    }
                  }}
                  darkMode={darkMode}
                />
              )}
              {leftSidebarTab === 'canvas' && (
                <CanvasPanel
                  backgroundColor={backgroundColor}
                  setBackgroundColor={setBackgroundColor}
                  backgroundColors={backgroundColors}
                  showGrid={showGrid}
                  setShowGrid={setShowGrid}
                  gridSize={gridSize}
                  setGridSize={setGridSize}
                  snapToGrid={snapToGrid}
                  setSnapToGrid={setSnapToGrid}
                  onExport={() => setShowExportModal(true)}
                  exportFormat={exportFormat}
                  setExportFormat={setExportFormat}
                  exportQuality={exportQuality}
                  setExportQuality={setExportQuality}
                  onClearCanvas={clearDrawing}
                  darkMode={darkMode}
                />
              )}
            </TabPanel>
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
            <svg
              ref={canvasRef}
              viewBox="0 0 420 300"
              className="w-full h-full touch-none"
              style={{
                backgroundColor,
                cursor: (activeTool === 'brush' || activeTool === 'eraser') ? 'none'
                  : activeTool === 'eyedropper' ? 'crosshair'
                  : activeTool === 'fill' ? 'pointer'
                  : 'default'
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={(e) => { setCursorPosition(null); handlePointerUp(e); }}
              onPointerCancel={handlePointerUp}
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
                  {layer.paths.map((path, i) => path.type === 'text' ? (
                    <text
                      key={path.id || i}
                      x={path.x}
                      y={path.y}
                      fill={path.color}
                      fontSize={path.fontSize}
                      fontFamily={path.fontFamily}
                      opacity={path.opacity}
                    >
                      {path.text}
                    </text>
                  ) : path.isShape ? (
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

              {/* Lazy brush indicator */}
              {lazyBrushEnabled && lazyBrushIndicator && isDrawing && (
                <g opacity="0.6" pointerEvents="none">
                  {/* String line */}
                  <line
                    x1={lazyBrushIndicator.cursor.x}
                    y1={lazyBrushIndicator.cursor.y}
                    x2={lazyBrushIndicator.brush.x}
                    y2={lazyBrushIndicator.brush.y}
                    stroke="#9333ea"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                  {/* Cursor circle */}
                  <circle
                    cx={lazyBrushIndicator.cursor.x}
                    cy={lazyBrushIndicator.cursor.y}
                    r="4"
                    fill="none"
                    stroke="#9333ea"
                    strokeWidth="1"
                  />
                  {/* Brush position circle */}
                  <circle
                    cx={lazyBrushIndicator.brush.x}
                    cy={lazyBrushIndicator.brush.y}
                    r={brushSize / 2}
                    fill={selectedColor}
                    opacity="0.5"
                    stroke="#9333ea"
                    strokeWidth="1"
                  />
                  {/* Lazy radius circle (shows string length) */}
                  <circle
                    cx={lazyBrushIndicator.brush.x}
                    cy={lazyBrushIndicator.brush.y}
                    r={lazyBrushRadius}
                    fill="none"
                    stroke="#9333ea"
                    strokeWidth="0.5"
                    strokeDasharray="2,4"
                    opacity="0.3"
                  />
                </g>
              )}

              {/* Current shape preview */}
              {currentShape && (
                <path d={shapeToPath(currentShape)} fill={currentShape.fill ? currentShape.color : 'none'} stroke={currentShape.color} strokeWidth={currentShape.strokeWidth} opacity={0.6} strokeDasharray="4,4" />
              )}

              {/* Brush cursor preview */}
              {cursorPosition && !isDrawing && (activeTool === 'brush' || activeTool === 'eraser') && (
                <g pointerEvents="none">
                  {/* Outer ring */}
                  <circle
                    cx={cursorPosition.x}
                    cy={cursorPosition.y}
                    r={brushSize / 2}
                    fill="none"
                    stroke={darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)'}
                    strokeWidth="1"
                  />
                  {/* Color preview fill */}
                  <circle
                    cx={cursorPosition.x}
                    cy={cursorPosition.y}
                    r={brushSize / 2 - 1}
                    fill={activeTool === 'eraser' ? 'rgba(255,255,255,0.3)' : selectedColor}
                    opacity={activeTool === 'eraser' ? 0.5 : 0.4}
                  />
                  {/* Center dot */}
                  <circle
                    cx={cursorPosition.x}
                    cy={cursorPosition.y}
                    r="1.5"
                    fill={darkMode ? '#fff' : '#000'}
                  />
                </g>
              )}

              {/* Eyedropper cursor */}
              {cursorPosition && activeTool === 'eyedropper' && (
                <g pointerEvents="none">
                  <circle
                    cx={cursorPosition.x}
                    cy={cursorPosition.y}
                    r="12"
                    fill="none"
                    stroke={darkMode ? '#fff' : '#000'}
                    strokeWidth="2"
                  />
                  <circle
                    cx={cursorPosition.x}
                    cy={cursorPosition.y}
                    r="6"
                    fill={selectedColor}
                    stroke={darkMode ? '#fff' : '#000'}
                    strokeWidth="1"
                  />
                </g>
              )}
            </svg>

            {/* Text Input Overlay */}
            {isEditingText && textPosition && (
              <div
                className="absolute"
                style={{
                  left: `${(textPosition.x / 420) * 100}%`,
                  top: `${(textPosition.y / 300) * 100}%`,
                  transform: 'translate(-4px, -50%)',
                }}
              >
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmText();
                    if (e.key === 'Escape') {
                      setIsEditingText(false);
                      setTextPosition(null);
                    }
                  }}
                  autoFocus
                  placeholder="Type here..."
                  className={`
                    px-2 py-1 rounded border-2 border-purple-500 outline-none
                    ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                  `}
                  style={{
                    fontSize: `${fontSize * zoom * (canvasWidth / 420)}px`,
                    fontFamily: fontFamily.value,
                    color: selectedColor,
                    minWidth: '100px',
                  }}
                />
                <div className="flex gap-1 mt-1">
                  <button
                    onClick={confirmText}
                    className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => { setIsEditingText(false); setTextPosition(null); }}
                    className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    ✗
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Floating Toolbar */}
          {!focusMode && (
            <FloatingToolbar
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              selectedColor={selectedColor}
              onUndo={undo}
              onRedo={redo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              onZoomIn={() => setZoom(z => Math.min(4, z + 0.25))}
              onZoomOut={() => setZoom(z => Math.max(0.25, z - 0.25))}
              onZoomReset={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              zoom={zoom}
              onToggleGrid={() => setShowGrid(!showGrid)}
              showGrid={showGrid}
              recentColors={recentColors}
              onSelectColor={setSelectedColor}
              darkMode={darkMode}
              position="bottom"
            />
          )}
        </div>

        {/* Right Sidebar - Layers, Wellness & Mood (desktop only) - hidden on tablet/mobile and in focus mode */}
        {isDesktop && !focusMode && (
          <div className={`w-56 ${theme.panel} border-l ${theme.border} flex flex-col overflow-hidden`}>
            <TabPanel
              tabs={[
                { id: 'layers', icon: '📑', label: 'Layers' },
                { id: 'wellness', icon: '🧘', label: 'Wellness' },
                { id: 'mood', icon: '💭', label: 'Mood' },
              ]}
              activeTab={rightSidebarTab}
              onChange={setRightSidebarTab}
              darkMode={darkMode}
            >
              {rightSidebarTab === 'layers' && (
                <LayersPanel
                  layers={layers}
                  activeLayerId={activeLayerId}
                  setActiveLayerId={setActiveLayerId}
                  onAddLayer={addLayer}
                  onDeleteLayer={deleteLayer}
                  onToggleVisibility={toggleLayerVisibility}
                  onToggleLock={toggleLayerLock}
                  onLayerOpacity={setLayerOpacity}
                  onMoveLayer={(id, dir) => {
                    const idx = layers.findIndex(l => l.id === id);
                    if (dir === 'up' && idx < layers.length - 1) {
                      const newLayers = [...layers];
                      [newLayers[idx], newLayers[idx + 1]] = [newLayers[idx + 1], newLayers[idx]];
                      setLayers(newLayers);
                    } else if (dir === 'down' && idx > 0) {
                      const newLayers = [...layers];
                      [newLayers[idx], newLayers[idx - 1]] = [newLayers[idx - 1], newLayers[idx]];
                      setLayers(newLayers);
                    }
                  }}
                  onDuplicateLayer={duplicateLayer}
                  onMergeDown={(id) => {
                    const idx = layers.findIndex(l => l.id === id);
                    if (idx > 0) {
                      const newLayers = [...layers];
                      newLayers[idx - 1].paths = [...newLayers[idx - 1].paths, ...newLayers[idx].paths];
                      newLayers.splice(idx, 1);
                      setLayers(newLayers);
                      setActiveLayerId(newLayers[idx - 1].id);
                    }
                  }}
                  darkMode={darkMode}
                />
              )}
              {rightSidebarTab === 'wellness' && (
                <WellnessPanel
                  sessionSeconds={sessionSeconds}
                  formatTime={formatTime}
                  breakInterval={breakInterval}
                  setBreakInterval={setBreakInterval}
                  breakReminderEnabled={breakReminderEnabled}
                  setBreakReminderEnabled={setBreakReminderEnabled}
                  onTakeBreak={() => setLastBreakTime(Date.now())}
                  showBreathing={showBreathing}
                  setShowBreathing={setShowBreathing}
                  breathingPatterns={breathingPatterns}
                  breathingPattern={breathingPattern}
                  setBreathingPattern={setBreathingPattern}
                  breathingPhase={breathingPhase}
                  breathingProgress={breathingProgress}
                  showDailyPrompt={showDailyPrompt}
                  setShowDailyPrompt={setShowDailyPrompt}
                  currentPrompt={currentPrompt}
                  onNewPrompt={() => {
                    const newIdx = Math.floor(Math.random() * dailyPrompts.length);
                    setCurrentPrompt(dailyPrompts[newIdx]);
                  }}
                  ambientSounds={ambientSounds}
                  activeSounds={activeSounds}
                  onToggleSound={(soundId) => {
                    if (activeSounds[soundId]) {
                      stopSound(soundId);
                      setActiveSounds(prev => { const n = {...prev}; delete n[soundId]; return n; });
                    } else {
                      startSound(soundId, masterVolume);
                      setActiveSounds(prev => ({ ...prev, [soundId]: true }));
                    }
                  }}
                  masterVolume={masterVolume}
                  setMasterVolume={setMasterVolume}
                  musicTracks={musicTracks}
                  isPlaying={isPlaying}
                  currentTrack={currentTrack}
                  playTrack={playTrack}
                  stopMusic={stopMusic}
                  darkMode={darkMode}
                />
              )}
              {rightSidebarTab === 'mood' && (
                <MoodTracker
                  currentMood={currentMood}
                  moodNote={moodNote}
                  setMoodNote={setMoodNote}
                  selectedActivities={selectedActivities}
                  toggleActivity={toggleActivity}
                  showMoodPrompt={showMoodPrompt}
                  dismissMoodPrompt={dismissMoodPrompt}
                  showMoodHistory={showMoodHistory}
                  setShowMoodHistory={setShowMoodHistory}
                  groupedHistory={groupedHistory}
                  recordMood={recordMood}
                  deleteMoodEntry={deleteMoodEntry}
                  clearMoodHistory={clearMoodHistory}
                  moodStats={moodStats}
                  moodTrend={moodTrend}
                  moodOptions={moodOptions}
                  activityTags={activityTags}
                  darkMode={darkMode}
                />
              )}
            </TabPanel>
          </div>
        )}
      </div>

      {/* Mobile Tools Bottom Sheet */}
      {isMobile && (
        <BottomSheet
          isOpen={showMobileTools}
          onClose={() => setShowMobileTools(false)}
          title="Tools & Colors"
          darkMode={darkMode}
        >
          <TabPanel
            tabs={[
              { id: 'tools', icon: '🖌️', label: 'Tools' },
              { id: 'colors', icon: '🎨', label: 'Colors' },
              { id: 'layers', icon: '📑', label: 'Layers' },
            ]}
            activeTab={leftSidebarTab}
            onChange={setLeftSidebarTab}
            darkMode={darkMode}
          >
            {leftSidebarTab === 'tools' && (
              <ToolsPanel
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                brushTypes={brushTypes}
                brushType={brushType}
                setBrushType={setBrushType}
                brushSize={brushSize}
                setBrushSize={setBrushSize}
                brushStabilization={brushStabilization}
                setBrushStabilization={setBrushStabilization}
                lazyBrushEnabled={lazyBrushEnabled}
                setLazyBrushEnabled={setLazyBrushEnabled}
                lazyBrushRadius={lazyBrushRadius}
                setLazyBrushRadius={setLazyBrushRadius}
                palmRejection={palmRejection}
                setPalmRejection={setPalmRejection}
                fontSize={fontSize}
                setFontSize={setFontSize}
                fontFamilies={fontFamilies}
                fontFamily={fontFamily}
                setFontFamily={setFontFamily}
                shapeTools={shapeTools}
                shapeType={shapeType}
                setShapeType={setShapeType}
                shapeFill={shapeFill}
                setShapeFill={setShapeFill}
                symmetryModes={symmetryModes}
                symmetryMode={symmetryMode}
                setSymmetryMode={setSymmetryMode}
                darkMode={darkMode}
              />
            )}
            {leftSidebarTab === 'colors' && (
              <ColorsPanel
                colorPalettes={colorPalettes}
                currentPalette={currentPalette}
                setCurrentPalette={setCurrentPalette}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                colorOpacity={colorOpacity}
                setColorOpacity={setColorOpacity}
                hexInput={hexInput}
                setHexInput={setHexInput}
                onHexChange={handleHexChange}
                recentColors={recentColors}
                showColorHarmony={showColorHarmony}
                setShowColorHarmony={setShowColorHarmony}
                colorHarmonyTypes={colorHarmonyTypes}
                selectedHarmony={selectedHarmony}
                setSelectedHarmony={setSelectedHarmony}
                harmonyColors={harmonyColors}
                darkMode={darkMode}
              />
            )}
            {leftSidebarTab === 'layers' && (
              <LayersPanel
                layers={layers}
                activeLayerId={activeLayerId}
                setActiveLayerId={setActiveLayerId}
                onAddLayer={addLayer}
                onDeleteLayer={deleteLayer}
                onToggleVisibility={toggleLayerVisibility}
                onToggleLock={toggleLayerLock}
                onLayerOpacity={setLayerOpacity}
                onMoveLayer={(id, dir) => {
                  const idx = layers.findIndex(l => l.id === id);
                  if (dir === 'up' && idx < layers.length - 1) {
                    const newLayers = [...layers];
                    [newLayers[idx], newLayers[idx + 1]] = [newLayers[idx + 1], newLayers[idx]];
                    setLayers(newLayers);
                  } else if (dir === 'down' && idx > 0) {
                    const newLayers = [...layers];
                    [newLayers[idx], newLayers[idx - 1]] = [newLayers[idx - 1], newLayers[idx]];
                    setLayers(newLayers);
                  }
                }}
                onDuplicateLayer={duplicateLayer}
                onMergeDown={(id) => {
                  const idx = layers.findIndex(l => l.id === id);
                  if (idx > 0) {
                    const newLayers = [...layers];
                    newLayers[idx - 1].paths = [...newLayers[idx - 1].paths, ...newLayers[idx].paths];
                    newLayers.splice(idx, 1);
                    setLayers(newLayers);
                    setActiveLayerId(newLayers[idx - 1].id);
                  }
                }}
                darkMode={darkMode}
              />
            )}
          </TabPanel>
        </BottomSheet>
      )}

      {/* Status Bar - hidden in focus mode */}
      {!focusMode && (
        <StatusBar
          activeTool={activeTool}
          brushType={brushType}
          brushSize={brushSize}
          shapeType={shapeType}
          activeLayer={getActiveLayer()}
          layerCount={layers.length}
          symmetryMode={symmetryMode}
          historyIndex={historyIndex}
          historyLength={history.length}
          darkMode={darkMode}
        />
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
              <>
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
                  <div className={`text-xs ${theme.textMuted} mt-1`}>
                    {420 * exportQuality} × {300 * exportQuality}px
                  </div>
                </div>
                {exportFormat === 'png' && (
                  <div className="mb-4">
                    <label className={`flex items-center justify-between p-3 rounded-xl cursor-pointer ${theme.hover} border ${theme.border}`}>
                      <span className={`text-sm ${theme.text}`}>Transparent background</span>
                      <input
                        type="checkbox"
                        checked={exportTransparent}
                        onChange={(e) => setExportTransparent(e.target.checked)}
                        className="w-4 h-4 accent-purple-500"
                      />
                    </label>
                  </div>
                )}
              </>
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
