import React, { useState, useRef, useEffect, useCallback } from 'react';

// ============ CONSTANTS ============

const colors = [
  '#FF6B6B', '#FF8E72', '#FFA94D', '#FFD93D', '#6BCB77', '#4D96FF',
  '#845EC2', '#D65DB1', '#FF6F91', '#2C3E50', '#E8E8E8', '#FFFFFF',
  '#F8B4B4', '#FFDAB9', '#B5EAD7', '#C7CEEA', '#E2F0CB', '#FFDAC1',
];

const brushSizes = [4, 8, 16, 24, 36];

const templates = [
  { name: 'Bunny', icon: '🐰', paths: [
    { id: 'body', d: 'M150 200 Q150 140 180 120 Q210 100 240 120 Q270 140 270 200 Q270 280 210 300 Q150 280 150 200' },
    { id: 'head', d: 'M170 130 Q170 80 210 60 Q250 80 250 130 Q250 160 210 170 Q170 160 170 130' },
    { id: 'ear-left', d: 'M175 70 Q160 20 170 -20 Q190 -10 195 40 Q195 60 185 70' },
    { id: 'ear-right', d: 'M245 70 Q260 20 250 -20 Q230 -10 225 40 Q225 60 235 70' },
    { id: 'tail', d: 'M265 240 Q290 230 295 250 Q290 270 265 260' },
  ]},
  { name: 'Flower', icon: '🌸', paths: [
    { id: 'petal1', d: 'M210 100 Q240 60 210 20 Q180 60 210 100' },
    { id: 'petal2', d: 'M210 100 Q270 100 290 70 Q260 40 210 100' },
    { id: 'petal3', d: 'M210 100 Q270 140 290 180 Q240 160 210 100' },
    { id: 'petal4', d: 'M210 100 Q180 160 150 180 Q150 140 210 100' },
    { id: 'petal5', d: 'M210 100 Q150 100 130 70 Q160 40 210 100' },
    { id: 'center', d: 'M210 100 m-25 0 a25 25 0 1 0 50 0 a25 25 0 1 0 -50 0' },
    { id: 'stem', d: 'M200 125 Q200 200 195 280 Q205 285 215 280 Q220 200 220 125' },
  ]},
  { name: 'Star', icon: '⭐', paths: [
    { id: 'outer', d: 'M210 20 L240 90 L320 100 L260 150 L280 230 L210 190 L140 230 L160 150 L100 100 L180 90 Z' },
    { id: 'inner', d: 'M210 60 L225 100 L270 105 L240 130 L250 175 L210 155 L170 175 L180 130 L150 105 L195 100 Z' },
  ]},
  { name: 'Heart', icon: '❤️', paths: [
    { id: 'heart', d: 'M210 280 Q100 200 100 120 Q100 60 160 60 Q210 60 210 120 Q210 60 260 60 Q320 60 320 120 Q320 200 210 280' },
  ]},
  { name: 'Cat', icon: '🐱', paths: [
    { id: 'body', d: 'M120 180 Q100 220 120 280 Q180 320 260 280 Q280 220 260 180 Q220 140 180 140 Q140 140 120 180' },
    { id: 'head', d: 'M150 140 Q150 80 210 70 Q270 80 270 140 Q270 180 210 190 Q150 180 150 140' },
    { id: 'ear-left', d: 'M155 100 L140 50 L180 80 Z' },
    { id: 'ear-right', d: 'M265 100 L280 50 L240 80 Z' },
  ]},
  { name: 'Fish', icon: '🐠', paths: [
    { id: 'body', d: 'M80 150 Q120 80 200 80 Q300 80 340 150 Q300 220 200 220 Q120 220 80 150' },
    { id: 'tail', d: 'M70 150 Q30 100 50 60 Q60 100 80 150 Q60 200 50 240 Q30 200 70 150' },
    { id: 'eye', d: 'M280 130 m-15 0 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0' },
  ]},
  { name: 'Butterfly', icon: '🦋', paths: [
    { id: 'wing-tl', d: 'M200 150 Q150 100 100 80 Q80 120 100 160 Q140 180 200 150' },
    { id: 'wing-tr', d: 'M220 150 Q270 100 320 80 Q340 120 320 160 Q280 180 220 150' },
    { id: 'wing-bl', d: 'M200 170 Q150 200 120 240 Q150 260 180 240 Q200 210 200 170' },
    { id: 'wing-br', d: 'M220 170 Q270 200 300 240 Q270 260 240 240 Q220 210 220 170' },
    { id: 'body', d: 'M200 100 Q210 100 220 100 L215 280 L205 280 Z' },
  ]},
  { name: 'House', icon: '🏠', paths: [
    { id: 'roof', d: 'M100 140 L210 50 L320 140 Z' },
    { id: 'walls', d: 'M120 140 L120 280 L300 280 L300 140 Z' },
    { id: 'door', d: 'M180 280 L180 200 L240 200 L240 280 Z' },
    { id: 'window', d: 'M250 160 L250 190 L280 190 L280 160 Z' },
  ]},
  { name: 'Free', icon: '✏️', paths: [] },
];

// ============ SMOOTH PATH ============

const smoothPath = (points) => {
  if (!points || points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x} ${points[i].y} ${midX} ${midY}`;
  }
  d += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
  return d;
};

// ============ MAIN COMPONENT ============

export default function ColoringGame() {
  // State
  const [template, setTemplate] = useState(0);
  const [tool, setTool] = useState('brush'); // brush, eraser, fill
  const [color, setColor] = useState(colors[0]);
  const [brushSize, setBrushSize] = useState(brushSizes[2]);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [filledColors, setFilledColors] = useState({});
  const [strokes, setStrokes] = useState([]);
  const [currentStroke, setCurrentStroke] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [showMenu, setShowMenu] = useState(null); // 'templates', 'colors', 'bg'
  const [mirror, setMirror] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const canvasRef = useRef(null);

  // Get pointer position
  const getPos = useCallback((e) => {
    const svg = canvasRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * 420,
      y: ((clientY - rect.top) / rect.height) * 300
    };
  }, []);

  // Drawing handlers
  const startDraw = useCallback((e) => {
    if (tool === 'fill') return;
    e.preventDefault();
    const pos = getPos(e);
    if (!pos) return;

    setHistory(h => [...h.slice(-30), { strokes: [...strokes], filledColors: {...filledColors} }]);
    setIsDrawing(true);
    setCurrentStroke({
      color: tool === 'eraser' ? bgColor : color,
      size: brushSize,
      points: [pos]
    });
  }, [tool, getPos, strokes, filledColors, bgColor, color, brushSize]);

  const draw = useCallback((e) => {
    if (!isDrawing || !currentStroke) return;
    e.preventDefault();
    const pos = getPos(e);
    if (!pos) return;

    setCurrentStroke(s => ({
      ...s,
      points: [...s.points, pos]
    }));
  }, [isDrawing, currentStroke, getPos]);

  const endDraw = useCallback(() => {
    if (!isDrawing || !currentStroke) return;
    setIsDrawing(false);

    if (currentStroke.points.length > 1) {
      const newStrokes = [currentStroke];

      // Mirror stroke if enabled
      if (mirror) {
        newStrokes.push({
          ...currentStroke,
          points: currentStroke.points.map(p => ({ x: 420 - p.x, y: p.y }))
        });
      }

      setStrokes(s => [...s, ...newStrokes]);
    }
    setCurrentStroke(null);
  }, [isDrawing, currentStroke, mirror]);

  // Fill handler
  const handleFill = useCallback((pathId) => {
    if (tool !== 'fill') return;
    setHistory(h => [...h.slice(-30), { strokes: [...strokes], filledColors: {...filledColors} }]);

    const key = `${template}-${pathId}`;
    setFilledColors(c => ({ ...c, [key]: color }));

    // Check if complete
    const t = templates[template];
    if (t.paths.length > 0) {
      const newFilled = { ...filledColors, [key]: color };
      if (t.paths.every(p => newFilled[`${template}-${p.id}`])) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    }
  }, [tool, template, color, strokes, filledColors]);

  // Undo
  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setStrokes(prev.strokes);
    setFilledColors(prev.filledColors);
    setHistory(h => h.slice(0, -1));
  }, [history]);

  // Clear
  const clear = useCallback(() => {
    setHistory(h => [...h.slice(-30), { strokes: [...strokes], filledColors: {...filledColors} }]);
    setStrokes([]);
    const newFilled = { ...filledColors };
    Object.keys(newFilled).filter(k => k.startsWith(`${template}-`)).forEach(k => delete newFilled[k]);
    setFilledColors(newFilled);
  }, [strokes, filledColors, template]);

  // Save
  const save = useCallback(() => {
    const svg = canvasRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 840;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 840, 600);
      ctx.drawImage(img, 0, 0, 840, 600);

      const a = document.createElement('a');
      a.download = `coloring-${Date.now()}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }, [bgColor]);

  // Close menus on outside click
  useEffect(() => {
    const close = () => setShowMenu(null);
    if (showMenu) {
      document.addEventListener('click', close);
      return () => document.removeEventListener('click', close);
    }
  }, [showMenu]);

  const t = templates[template];

  return (
    <div className="h-screen flex flex-col bg-gray-100 select-none overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white shadow-sm px-2 py-2 flex items-center gap-2 z-20">
        {/* Template Picker */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(showMenu === 'templates' ? null : 'templates'); }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
          >
            <span className="text-xl">{t.icon}</span>
            <span className="text-sm font-medium hidden sm:block">{t.name}</span>
            <span className="text-xs text-gray-400">▼</span>
          </button>

          {showMenu === 'templates' && (
            <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl p-3 grid grid-cols-3 gap-2 z-50 w-56" onClick={e => e.stopPropagation()}>
              {templates.map((tm, i) => (
                <button
                  key={tm.name}
                  onClick={() => { setTemplate(i); setShowMenu(null); }}
                  className={`p-3 rounded-xl text-center transition ${template === i ? 'bg-purple-100 ring-2 ring-purple-400' : 'hover:bg-gray-100'}`}
                >
                  <div className="text-2xl">{tm.icon}</div>
                  <div className="text-xs mt-1">{tm.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200" />

        {/* Tools */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {[
            { id: 'brush', icon: '🖌️', label: 'Draw' },
            { id: 'eraser', icon: '🧽', label: 'Erase' },
            { id: 'fill', icon: '🪣', label: 'Fill' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`px-3 py-2 rounded-lg transition ${tool === t.id ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title={t.label}
            >
              <span className="text-lg">{t.icon}</span>
            </button>
          ))}
        </div>

        {/* Mirror Toggle */}
        <button
          onClick={() => setMirror(!mirror)}
          className={`px-3 py-2 rounded-xl transition ${mirror ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          title="Mirror Drawing"
        >
          ↔️
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <button onClick={undo} disabled={history.length === 0} className={`p-2 rounded-xl transition ${history.length > 0 ? 'hover:bg-gray-100' : 'opacity-30'}`} title="Undo">
          ↩️
        </button>
        <button onClick={clear} className="p-2 rounded-xl hover:bg-gray-100 transition" title="Clear">
          🗑️
        </button>
        <button onClick={save} className="p-2 rounded-xl hover:bg-gray-100 transition" title="Save">
          💾
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="relative w-full max-w-3xl aspect-[7/5] rounded-2xl shadow-xl overflow-hidden bg-white">
          {/* Celebration */}
          {showCelebration && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-20 animate-pulse">
              <div className="text-center">
                <div className="text-6xl animate-bounce">🌟</div>
                <div className="text-2xl font-bold text-purple-500 mt-2">Beautiful!</div>
              </div>
            </div>
          )}

          {/* Mirror Line */}
          {mirror && (
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-purple-300 z-10 pointer-events-none" style={{ transform: 'translateX(-50%)' }} />
          )}

          <svg
            ref={canvasRef}
            viewBox="0 0 420 300"
            className="w-full h-full touch-none"
            style={{ backgroundColor: bgColor }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          >
            {/* Strokes */}
            {strokes.map((s, i) => (
              <path
                key={i}
                d={smoothPath(s.points)}
                stroke={s.color}
                strokeWidth={s.size}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}

            {/* Current stroke */}
            {currentStroke && currentStroke.points.length > 1 && (
              <>
                <path
                  d={smoothPath(currentStroke.points)}
                  stroke={currentStroke.color}
                  strokeWidth={currentStroke.size}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {mirror && (
                  <path
                    d={smoothPath(currentStroke.points.map(p => ({ x: 420 - p.x, y: p.y })))}
                    stroke={currentStroke.color}
                    strokeWidth={currentStroke.size}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity={0.5}
                  />
                )}
              </>
            )}

            {/* Template paths */}
            {t.paths.map(path => (
              <path
                key={path.id}
                d={path.d}
                fill={filledColors[`${template}-${path.id}`] || 'transparent'}
                stroke="#9CA3AF"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => handleFill(path.id)}
                className="transition-colors duration-150"
                style={{ cursor: tool === 'fill' ? 'pointer' : 'default' }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3 z-20">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          {/* Current Color */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(showMenu === 'colors' ? null : 'colors'); }}
              className="w-10 h-10 rounded-xl shadow-inner border-2 border-gray-200"
              style={{ backgroundColor: color }}
            />

            {showMenu === 'colors' && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-xl p-3 z-50" onClick={e => e.stopPropagation()}>
                <div className="grid grid-cols-6 gap-2 w-56">
                  {colors.map(c => (
                    <button
                      key={c}
                      onClick={() => { setColor(c); setShowMenu(null); }}
                      className={`w-8 h-8 rounded-lg transition-transform ${color === c ? 'ring-2 ring-purple-400 scale-110' : 'hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Brush Sizes */}
          {(tool === 'brush' || tool === 'eraser') && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {brushSizes.map(size => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${brushSize === size ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <div
                    className="rounded-full bg-gray-600"
                    style={{ width: Math.max(6, size / 3), height: Math.max(6, size / 3) }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Background Color */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(showMenu === 'bg' ? null : 'bg'); }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
            >
              <div className="w-5 h-5 rounded border border-gray-300" style={{ backgroundColor: bgColor }} />
              <span className="text-sm text-gray-600 hidden sm:block">Background</span>
            </button>

            {showMenu === 'bg' && (
              <div className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-xl p-3 z-50" onClick={e => e.stopPropagation()}>
                <div className="grid grid-cols-6 gap-2">
                  {['#FFFFFF', '#FFF8E7', '#E8F5E9', '#E3F2FD', '#FCE4EC', '#F3E5F5',
                    '#FFFDE7', '#E0F7FA', '#FBE9E7', '#F5F5F5', '#263238', '#1a1a2e'].map(c => (
                    <button
                      key={c}
                      onClick={() => { setBgColor(c); setShowMenu(null); }}
                      className={`w-8 h-8 rounded-lg border border-gray-200 transition-transform ${bgColor === c ? 'ring-2 ring-purple-400 scale-110' : 'hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
