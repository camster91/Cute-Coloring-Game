import React, { useState } from 'react';

/**
 * Gradient Editor Panel Component
 */
export default function GradientEditor({
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
  presetGradients,
  customGradients,
  loadPreset,
  saveCustomGradient,
  deleteCustomGradient,
  loadCustomGradient,
  reverseGradient,
  rotateGradient,
  gradientTypes,
  radialPosition,
  setRadialPosition,
  darkMode,
}) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newGradientName, setNewGradientName] = useState('');

  const handleSaveGradient = () => {
    if (newGradientName.trim()) {
      saveCustomGradient(newGradientName.trim());
      setNewGradientName('');
      setShowSaveDialog(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Gradient Fill
        </span>
        <button
          onClick={() => setGradientEnabled(!gradientEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            gradientEnabled
              ? 'bg-indigo-500'
              : darkMode ? 'bg-gray-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              gradientEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {gradientEnabled && (
        <>
          {/* Preview */}
          <div
            className="h-16 rounded-lg border-2 border-gray-300 shadow-inner"
            style={{ background: gradientCSS }}
          />

          {/* Gradient Type */}
          <div className="flex gap-2">
            {gradientTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setGradientType(type.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  gradientType === type.id
                    ? 'bg-indigo-500 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{type.icon}</span>
                {type.name}
              </button>
            ))}
          </div>

          {/* Angle (for linear) or Position (for radial) */}
          {gradientType === 'linear' ? (
            <div>
              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Angle: {gradientAngle}°
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={gradientAngle}
                  onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                  className="flex-1"
                />
                <button
                  onClick={rotateGradient}
                  className={`p-2 rounded-lg ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  title="Rotate 45°"
                >
                  ↻
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Center Position: X:{radialPosition.x}% Y:{radialPosition.y}%
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={radialPosition.x}
                  onChange={(e) => setRadialPosition(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={radialPosition.y}
                  onChange={(e) => setRadialPosition(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Color Stops */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Color Stops
              </label>
              <div className="flex gap-1">
                <button
                  onClick={reverseGradient}
                  className={`text-xs px-2 py-1 rounded ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  title="Reverse colors"
                >
                  ⇄
                </button>
                <button
                  onClick={() => addColorStop()}
                  className={`text-xs px-2 py-1 rounded ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  title="Add color stop"
                >
                  + Add
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {gradientColors.map((stop, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateColorStop(index, { color: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stop.position}
                    onChange={(e) => updateColorStop(index, { position: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className={`text-xs w-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {stop.position}%
                  </span>
                  {gradientColors.length > 2 && (
                    <button
                      onClick={() => removeColorStop(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Remove stop"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preset Gradients */}
          <div>
            <label className={`block text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Presets
            </label>
            <div className="grid grid-cols-4 gap-2">
              {presetGradients.slice(0, 8).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => loadPreset(preset)}
                  className="h-8 rounded-lg border-2 border-transparent hover:border-indigo-400 transition-all"
                  style={{
                    background: `linear-gradient(${preset.angle}deg, ${preset.colors.join(', ')})`,
                  }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          {/* Custom Gradients */}
          {customGradients.length > 0 && (
            <div>
              <label className={`block text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Custom Gradients
              </label>
              <div className="grid grid-cols-4 gap-2">
                {customGradients.map((gradient) => (
                  <div key={gradient.id} className="relative group">
                    <button
                      onClick={() => loadCustomGradient(gradient)}
                      className="w-full h-8 rounded-lg border-2 border-transparent hover:border-indigo-400 transition-all"
                      style={{
                        background: `linear-gradient(${gradient.angle}deg, ${gradient.colors.join(', ')})`,
                      }}
                      title={gradient.name}
                    />
                    <button
                      onClick={() => deleteCustomGradient(gradient.id)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Custom Gradient */}
          {!showSaveDialog ? (
            <button
              onClick={() => setShowSaveDialog(true)}
              className={`w-full py-2 rounded-lg text-sm ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Save as Custom Gradient
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newGradientName}
                onChange={(e) => setNewGradientName(e.target.value)}
                placeholder="Gradient name..."
                className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                  darkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                } border`}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveGradient()}
                autoFocus
              />
              <button
                onClick={handleSaveGradient}
                className="px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setNewGradientName('');
                }}
                className={`px-3 py-2 rounded-lg text-sm ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                ×
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
