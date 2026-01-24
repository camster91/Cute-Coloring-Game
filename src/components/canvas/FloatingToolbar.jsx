import React, { useState } from 'react';

/**
 * Floating toolbar with quick actions over the canvas
 * Inspired by popular drawing apps like Procreate and Sketchbook
 */
export default function FloatingToolbar({
  // Tools
  activeTool,
  setActiveTool,
  brushSize,
  setBrushSize,
  selectedColor,
  // Actions
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  zoom,
  onToggleGrid,
  showGrid,
  // Color picker
  onColorPick,
  recentColors = [],
  onSelectColor,
  // State
  darkMode = false,
  position = 'bottom', // 'top' | 'bottom' | 'left' | 'right'
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBrushSize, setShowBrushSize] = useState(false);

  const theme = {
    bg: darkMode
      ? 'bg-gray-900/95 backdrop-blur-xl border-white/10'
      : 'bg-white/95 backdrop-blur-xl border-gray-200/50',
    text: darkMode ? 'text-white' : 'text-gray-800',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500',
    hover: darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100',
    active: 'bg-indigo-500 text-white',
  };

  const ToolButton = ({ icon, label, onClick, active, disabled, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-10 h-10 rounded-xl flex items-center justify-center
        transition-all duration-150
        ${active ? theme.active : theme.hover}
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
      `}
      title={label}
    >
      <span className="text-lg">{icon}</span>
      {children}
    </button>
  );

  const Divider = () => (
    <div className={`w-px h-6 ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
  );

  // Position styles
  const positionStyles = {
    bottom: 'bottom-4 left-1/2 -translate-x-1/2 flex-row',
    top: 'top-4 left-1/2 -translate-x-1/2 flex-row',
    left: 'left-4 top-1/2 -translate-y-1/2 flex-col',
    right: 'right-4 top-1/2 -translate-y-1/2 flex-col',
  };

  return (
    <div className={`
      absolute z-30 ${positionStyles[position]}
      ${theme.bg} border rounded-2xl shadow-2xl
      p-1.5 flex items-center gap-1
    `}>
      {/* Undo/Redo */}
      <ToolButton
        icon="↩"
        label="Undo (Ctrl+Z)"
        onClick={onUndo}
        disabled={!canUndo}
      />
      <ToolButton
        icon="↪"
        label="Redo (Ctrl+Y)"
        onClick={onRedo}
        disabled={!canRedo}
      />

      <Divider />

      {/* Tool Selection */}
      <ToolButton
        icon="✏️"
        label="Brush (B)"
        onClick={() => setActiveTool('brush')}
        active={activeTool === 'brush'}
      />
      <ToolButton
        icon="🧽"
        label="Eraser (E)"
        onClick={() => setActiveTool('eraser')}
        active={activeTool === 'eraser'}
      />
      <ToolButton
        icon="🪣"
        label="Fill (G)"
        onClick={() => setActiveTool('fill')}
        active={activeTool === 'fill'}
      />
      <ToolButton
        icon="💧"
        label="Eyedropper (I)"
        onClick={() => setActiveTool('eyedropper')}
        active={activeTool === 'eyedropper'}
      />

      <Divider />

      {/* Color Button */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            transition-all duration-150 hover:scale-105 active:scale-95
            ${theme.hover}
          `}
          title="Color"
        >
          <div
            className="w-6 h-6 rounded-full border-2 border-white shadow-md"
            style={{ backgroundColor: selectedColor }}
          />
        </button>

        {/* Color Picker Popup */}
        {showColorPicker && (
          <div className={`
            absolute bottom-full mb-2 left-1/2 -translate-x-1/2
            ${theme.bg} border rounded-xl shadow-2xl p-3 min-w-[140px]
          `}>
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {recentColors.slice(0, 10).map((color, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelectColor(color);
                    setShowColorPicker(false);
                  }}
                  className={`
                    w-6 h-6 rounded-lg border-2 transition-all
                    hover:scale-110 active:scale-95
                    ${color === selectedColor ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-white/50'}
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <button
              onClick={() => {
                onColorPick?.();
                setShowColorPicker(false);
              }}
              className={`w-full py-1.5 text-xs rounded-lg ${theme.hover} ${theme.text}`}
            >
              More Colors...
            </button>
          </div>
        )}
      </div>

      {/* Brush Size */}
      <div className="relative">
        <button
          onClick={() => setShowBrushSize(!showBrushSize)}
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            transition-all duration-150 hover:scale-105 active:scale-95
            ${theme.hover}
          `}
          title={`Brush Size: ${brushSize}px`}
        >
          <div
            className="rounded-full bg-current"
            style={{
              width: Math.max(4, Math.min(20, brushSize / 2)),
              height: Math.max(4, Math.min(20, brushSize / 2)),
            }}
          />
        </button>

        {/* Brush Size Slider Popup */}
        {showBrushSize && (
          <div className={`
            absolute bottom-full mb-2 left-1/2 -translate-x-1/2
            ${theme.bg} border rounded-xl shadow-2xl p-3 w-40
          `}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs ${theme.textMuted}`}>Size</span>
              <span className={`text-sm font-medium ${theme.text}`}>{brushSize}px</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between mt-2">
              {[4, 12, 24, 48].map(size => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center
                    ${brushSize === size ? 'bg-indigo-500 text-white' : theme.hover}
                    transition-all
                  `}
                >
                  <div
                    className="rounded-full bg-current"
                    style={{ width: size / 4 + 2, height: size / 4 + 2 }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Divider />

      {/* Zoom Controls */}
      <ToolButton
        icon="−"
        label="Zoom Out"
        onClick={onZoomOut}
        disabled={zoom <= 0.25}
      />
      <button
        onClick={onZoomReset}
        className={`
          px-2 h-10 rounded-xl flex items-center justify-center
          transition-all duration-150 hover:scale-105 active:scale-95
          ${theme.hover} text-xs font-medium ${theme.text}
        `}
        title="Reset Zoom"
      >
        {Math.round(zoom * 100)}%
      </button>
      <ToolButton
        icon="+"
        label="Zoom In"
        onClick={onZoomIn}
        disabled={zoom >= 4}
      />

      <Divider />

      {/* Grid Toggle */}
      <ToolButton
        icon="▦"
        label="Toggle Grid"
        onClick={onToggleGrid}
        active={showGrid}
      />
    </div>
  );
}
