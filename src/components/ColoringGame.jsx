import React, { useState, useRef, useEffect, useCallback } from 'react';

const colorPalettes = {
  soft: ['#FFB5BA', '#FFDAB3', '#FFF4B5', '#B5EAAA', '#B5D8EB', '#D4B5EB', '#F5CAE0', '#C9E4CA'],
  nature: ['#8FBC8F', '#DEB887', '#87CEEB', '#F0E68C', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'],
  ocean: ['#5DADE2', '#48C9B0', '#76D7C4', '#85C1E9', '#A3E4D7', '#D4E6F1', '#FADBD8', '#F5B7B1'],
  bold: ['#E74C3C', '#F39C12', '#27AE60', '#3498DB', '#9B59B6', '#1ABC9C', '#E91E63', '#FF5722'],
  pastel: ['#E8D5E0', '#D5E8E0', '#E8E5D5', '#D5DEE8', '#E8D5D5', '#D5E8E8', '#E0D5E8', '#E8E0D5'],
  rainbow: ['#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#1DD1A1', '#5F27CD', '#FF6B81', '#00D2D3'],
};

const backgroundColors = ['#FFFFFF', '#FFF8E7', '#E8F5E9', '#E3F2FD', '#FCE4EC', '#F3E5F5', '#FFFDE7', '#E0F7FA', '#FBE9E7', '#E8EAF6'];

const penSizes = [
  { name: 'XS', size: 4 },
  { name: 'S', size: 8 },
  { name: 'M', size: 14 },
  { name: 'L', size: 22 },
  { name: 'XL', size: 32 },
];

const musicTracks = [
  { name: 'Gentle Dreams', emoji: '🌙', frequency: 261.63, type: 'lullaby' },
  { name: 'Happy Meadow', emoji: '🌻', frequency: 329.63, type: 'cheerful' },
  { name: 'Ocean Waves', emoji: '🌊', frequency: 196.00, type: 'calm' },
  { name: 'Twinkle Stars', emoji: '✨', frequency: 392.00, type: 'playful' },
  { name: 'Rainy Day', emoji: '🌧️', frequency: 220.00, type: 'peaceful' },
  { name: 'Forest Birds', emoji: '🐦', frequency: 440.00, type: 'nature' },
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

// Simple melody generator using Web Audio API
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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch(e) {}
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  return { isPlaying, currentTrack, playTrack, stopMusic };
};

export default function ColoringGame() {
  const [currentDrawing, setCurrentDrawing] = useState(0);
  const [currentPalette, setCurrentPalette] = useState('soft');
  const [selectedColor, setSelectedColor] = useState(colorPalettes.soft[0]);
  const [filledColors, setFilledColors] = useState({});
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [zoom, setZoom] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);

  // Menu states
  const [activeMenu, setActiveMenu] = useState(null);

  // Drawing state
  const [tool, setTool] = useState('fill');
  const [penSize, setPenSize] = useState(penSizes[2]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPaths, setDrawingPaths] = useState({});
  const [currentPath, setCurrentPath] = useState(null);

  // Undo history
  const [history, setHistory] = useState([]);
  const maxHistory = 20;

  // Window size for responsive canvas
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  const canvasRef = useRef(null);
  const { isPlaying, currentTrack, playTrack, stopMusic } = useMusic();

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save state to history
  const saveToHistory = useCallback(() => {
    const state = {
      filledColors: { ...filledColors },
      drawingPaths: JSON.parse(JSON.stringify(drawingPaths)),
    };
    setHistory(prev => [...prev.slice(-maxHistory + 1), state]);
  }, [filledColors, drawingPaths]);

  // Undo function
  const undo = useCallback(() => {
    if (history.length === 0) return;

    const previousState = history[history.length - 1];
    setFilledColors(previousState.filledColors);
    setDrawingPaths(previousState.drawingPaths);
    setHistory(prev => prev.slice(0, -1));
  }, [history]);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const getPointerPosition = (e) => {
    const svg = canvasRef.current;
    if (!svg) return { x: 0, y: 0 };

    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: ((clientX - rect.left) / rect.width) * 420,
      y: ((clientY - rect.top) / rect.height) * 300
    };
  };

  const handlePointerDown = (e) => {
    if (tool === 'fill') return;
    e.preventDefault();
    saveToHistory();
    setIsDrawing(true);
    const pos = getPointerPosition(e);
    setCurrentPath({
      color: tool === 'eraser' ? backgroundColor : selectedColor,
      size: penSize.size,
      points: [pos]
    });
  };

  const handlePointerMove = (e) => {
    if (!isDrawing || tool === 'fill' || !currentPath) return;
    e.preventDefault();
    const pos = getPointerPosition(e);
    setCurrentPath(prev => ({
      ...prev,
      points: [...prev.points, pos]
    }));
  };

  const handlePointerUp = () => {
    if (!isDrawing || !currentPath) return;
    setIsDrawing(false);
    if (currentPath.points.length > 1) {
      setDrawingPaths(prev => ({
        ...prev,
        [currentDrawing]: [...(prev[currentDrawing] || []), currentPath]
      }));
    }
    setCurrentPath(null);
  };

  const pointsToPath = (points) => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  };

  const handlePathClick = (pathId) => {
    if (tool !== 'fill') return;
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
    setDrawingPaths(prev => ({ ...prev, [currentDrawing]: [] }));
  };

  // Save artwork as image
  const saveArtwork = async () => {
    if (!canvasRef.current || isSaving) return;

    setIsSaving(true);

    try {
      const svg = canvasRef.current;
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 840;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        // Fill background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw SVG
        ctx.drawImage(img, 0, 0, 840, 600);

        // Create download link
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `my-coloring-${drawings[currentDrawing].name.toLowerCase()}-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          URL.revokeObjectURL(svgUrl);
          setIsSaving(false);
        }, 'image/png');
      };

      img.onerror = () => {
        setIsSaving(false);
      };

      img.src = svgUrl;
    } catch (error) {
      setIsSaving(false);
    }
  };

  const drawing = drawings[currentDrawing];
  const colors = colorPalettes[currentPalette];
  const currentDrawingPaths = drawingPaths[currentDrawing] || [];

  // Calculate canvas dimensions based on screen size
  const getCanvasDimensions = () => {
    const baseWidth = 420;
    const baseHeight = 300;
    const maxWidth = Math.min(windowSize.width - 32, 900);
    const maxHeight = Math.min(windowSize.height - 120, 700);

    const scaledWidth = baseWidth * zoom;
    const scaledHeight = baseHeight * zoom;

    const finalWidth = Math.min(scaledWidth, maxWidth);
    const finalHeight = Math.min(scaledHeight, maxHeight);

    // Maintain aspect ratio
    const aspectRatio = baseWidth / baseHeight;
    if (finalWidth / finalHeight > aspectRatio) {
      return { width: finalHeight * aspectRatio, height: finalHeight };
    }
    return { width: finalWidth, height: finalWidth / aspectRatio };
  };

  const canvasDimensions = getCanvasDimensions();

  return (
    <div className="h-screen flex flex-col overflow-hidden select-none" style={{ backgroundColor: '#E8E0F0' }}>
      {/* Compact Top Toolbar */}
      <div className="flex items-center justify-between px-2 py-1.5 bg-white/90 backdrop-blur shadow-sm">
        <div className="flex items-center gap-1">
          {/* Menu Buttons */}
          <button
            onClick={() => toggleMenu('pictures')}
            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-all ${
              activeMenu === 'pictures' ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            🖼️ <span className="hidden sm:inline">Pictures</span>
          </button>
          <button
            onClick={() => toggleMenu('colors')}
            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-all ${
              activeMenu === 'colors' ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            🎨 <span className="hidden sm:inline">Colors</span>
          </button>
          <button
            onClick={() => toggleMenu('tools')}
            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-all ${
              activeMenu === 'tools' ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            🛠️ <span className="hidden sm:inline">Tools</span>
          </button>
          <button
            onClick={() => toggleMenu('settings')}
            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-all ${
              activeMenu === 'settings' ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            ⚙️
          </button>
          <button
            onClick={() => toggleMenu('music')}
            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-all ${
              activeMenu === 'music' ? 'bg-purple-200 text-purple-700' : isPlaying ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {isPlaying ? '🎵' : '🎶'}
          </button>
        </div>

        {/* Current Selection Indicator & Actions */}
        <div className="flex items-center gap-1.5">
          <div
            className="w-7 h-7 rounded-full border-2 border-purple-300 shadow"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-xs text-purple-500 hidden sm:inline">
            {tool === 'fill' ? '🪣' : tool === 'pen' ? `✏️${penSize.name}` : `🧽${penSize.name}`}
          </span>
          <button
            onClick={undo}
            disabled={history.length === 0}
            className={`px-2 py-1 rounded-full text-xs transition-all ${
              history.length > 0
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            title="Undo"
          >
            ↩️
          </button>
          <button
            onClick={saveArtwork}
            disabled={isSaving}
            className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs hover:bg-green-200 disabled:opacity-50"
            title="Save artwork"
          >
            {isSaving ? '⏳' : '💾'}
          </button>
          <button
            onClick={clearDrawing}
            className="px-2 py-1 bg-pink-100 text-pink-600 rounded-full text-xs hover:bg-pink-200"
            title="Clear"
          >
            🧹
          </button>
        </div>
      </div>

      {/* Dropdown Menus */}
      {activeMenu && (
        <div className="absolute top-12 left-0 right-0 z-40 px-2">
          <div className="bg-white rounded-xl shadow-lg p-3 mx-auto max-w-lg relative">
            {/* Pictures Menu */}
            {activeMenu === 'pictures' && (
              <div>
                <p className="text-purple-400 text-xs mb-2 text-center">Choose a picture</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {drawings.map((d, i) => (
                    <button
                      key={d.name}
                      onClick={() => { setCurrentDrawing(i); setActiveMenu(null); }}
                      className={`p-2 rounded-lg text-center transition-all ${
                        currentDrawing === i
                          ? 'bg-purple-200 scale-105'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-2xl">{d.icon}</div>
                      <div className="text-xs text-gray-600">{d.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors Menu */}
            {activeMenu === 'colors' && (
              <div>
                <div className="flex gap-1 mb-2 justify-center flex-wrap">
                  {Object.keys(colorPalettes).map((palette) => (
                    <button
                      key={palette}
                      onClick={() => {
                        setCurrentPalette(palette);
                        setSelectedColor(colorPalettes[palette][0]);
                      }}
                      className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                        currentPalette === palette ? 'bg-purple-200 text-purple-700' : 'bg-gray-100'
                      }`}
                    >
                      {palette}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 justify-center flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => { setSelectedColor(color); setActiveMenu(null); }}
                      className={`w-9 h-9 rounded-full transition-all ${
                        selectedColor === color ? 'ring-3 ring-purple-400 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tools Menu */}
            {activeMenu === 'tools' && (
              <div>
                <div className="flex gap-2 justify-center mb-3">
                  {[
                    { id: 'fill', icon: '🪣', label: 'Fill' },
                    { id: 'pen', icon: '✏️', label: 'Draw' },
                    { id: 'eraser', icon: '🧽', label: 'Erase' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTool(t.id)}
                      className={`px-4 py-2 rounded-full text-sm flex items-center gap-1 ${
                        tool === t.id ? 'bg-purple-200 text-purple-700' : 'bg-gray-100'
                      }`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
                {(tool === 'pen' || tool === 'eraser') && (
                  <div>
                    <p className="text-xs text-gray-500 text-center mb-1">Brush Size</p>
                    <div className="flex gap-2 justify-center">
                      {penSizes.map((size) => (
                        <button
                          key={size.name}
                          onClick={() => setPenSize(size)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            penSize.name === size.name ? 'bg-purple-200 ring-2 ring-purple-400' : 'bg-gray-100'
                          }`}
                        >
                          <div
                            className="rounded-full bg-gray-600"
                            style={{ width: Math.max(6, size.size / 2), height: Math.max(6, size.size / 2) }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings Menu */}
            {activeMenu === 'settings' && (
              <div>
                <div className="mb-3">
                  <p className="text-xs text-gray-500 text-center mb-2">Background Color</p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {backgroundColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setBackgroundColor(color)}
                        className={`w-8 h-8 rounded-full border transition-all ${
                          backgroundColor === color ? 'ring-2 ring-purple-400 scale-110' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 text-center mb-2">Zoom: {Math.round(zoom * 100)}%</p>
                  <div className="flex gap-2 justify-center items-center">
                    <button
                      onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
                      className="w-8 h-8 bg-gray-100 rounded-full text-lg hover:bg-gray-200"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={zoom * 100}
                      onChange={(e) => setZoom(e.target.value / 100)}
                      className="w-32 accent-purple-500"
                    />
                    <button
                      onClick={() => setZoom(z => Math.min(2, z + 0.25))}
                      className="w-8 h-8 bg-gray-100 rounded-full text-lg hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Music Menu */}
            {activeMenu === 'music' && (
              <div>
                <p className="text-purple-400 text-xs mb-2 text-center">🎵 Choose Music 🎵</p>
                <div className="grid grid-cols-3 gap-2">
                  {musicTracks.map((track) => (
                    <button
                      key={track.name}
                      onClick={() => isPlaying && currentTrack?.name === track.name ? stopMusic() : playTrack(track)}
                      className={`p-2 rounded-lg text-center transition-all ${
                        currentTrack?.name === track.name
                          ? 'bg-green-100 ring-2 ring-green-400'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-xl">{track.emoji}</div>
                      <div className="text-xs text-gray-600">{track.name}</div>
                    </button>
                  ))}
                </div>
                {isPlaying && (
                  <button
                    onClick={stopMusic}
                    className="mt-2 w-full py-1.5 bg-red-100 text-red-600 rounded-full text-sm hover:bg-red-200"
                  >
                    ⏹️ Stop Music
                  </button>
                )}
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => setActiveMenu(null)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs hover:bg-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Canvas Area - Takes remaining space */}
      <div
        className="flex-1 flex items-center justify-center p-2 overflow-auto"
        onClick={() => activeMenu && setActiveMenu(null)}
      >
        <div
          className="relative rounded-2xl shadow-xl overflow-hidden"
          style={{
            width: `${canvasDimensions.width}px`,
            height: `${canvasDimensions.height}px`,
          }}
        >
          {showCelebration && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="text-center animate-bounce">
                <div className="text-5xl mb-1">🌟</div>
                <p className="text-xl text-purple-400 font-bold">Beautiful!</p>
              </div>
            </div>
          )}

          <svg
            ref={canvasRef}
            viewBox="0 0 420 300"
            className="w-full h-full touch-none"
            style={{
              backgroundColor,
              cursor: tool === 'fill' ? 'pointer' : 'crosshair'
            }}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
          >
            {/* Saved drawing paths */}
            {currentDrawingPaths.map((path, i) => (
              <path
                key={i}
                d={pointsToPath(path.points)}
                stroke={path.color}
                strokeWidth={path.size}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
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
                    cursor: tool === 'fill' ? 'pointer' : 'crosshair',
                    pointerEvents: tool === 'fill' ? 'auto' : 'none'
                  }}
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="flex items-center justify-center gap-4 py-1.5 bg-white/60 text-xs text-purple-400">
        <span>{drawing.icon} {drawing.name}</span>
        {history.length > 0 && <span>↩️ {history.length}</span>}
      </div>

      {/* Music indicator */}
      {isPlaying && (
        <div className="fixed bottom-12 right-3 bg-white/90 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2 text-sm">
          <span className="animate-pulse">{currentTrack?.emoji}</span>
          <span className="text-purple-500 text-xs">{currentTrack?.name}</span>
          <button onClick={stopMusic} className="text-red-400 hover:text-red-600">⏹</button>
        </div>
      )}
    </div>
  );
}
