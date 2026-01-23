import { Slider } from '../ui';

/**
 * Tools panel containing brush, shape, and symmetry controls
 */
export default function ToolsPanel({
  // Tool state
  activeTool,
  setActiveTool,
  // Brush settings
  brushTypes,
  brushType,
  setBrushType,
  brushSize,
  setBrushSize,
  brushStabilization,
  setBrushStabilization,
  lazyBrushEnabled,
  setLazyBrushEnabled,
  lazyBrushRadius,
  setLazyBrushRadius,
  // Shape settings
  shapeTools,
  shapeType,
  setShapeType,
  shapeFill,
  setShapeFill,
  // Symmetry settings
  symmetryModes,
  symmetryMode,
  setSymmetryMode,
  // Theme
  darkMode = false,
}) {
  const theme = {
    text: darkMode ? 'text-gray-200' : 'text-gray-700',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    active: darkMode ? 'bg-gray-700' : 'bg-indigo-100 text-indigo-700',
    section: darkMode ? 'bg-gray-700/50' : 'bg-gray-50',
  };

  const Section = ({ title, children }) => (
    <div className="space-y-2">
      <h4 className={`text-xs font-semibold uppercase tracking-wide ${theme.textMuted}`}>
        {title}
      </h4>
      {children}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Primary Tools */}
      <Section title="Tools">
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: 'brush', icon: '🖌️', label: 'Brush' },
            { id: 'eraser', icon: '🧽', label: 'Eraser' },
            { id: 'fill', icon: '🪣', label: 'Fill' },
            { id: 'shape', icon: '⬜', label: 'Shapes' },
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`p-2 rounded-lg text-lg transition-all ${
                activeTool === tool.id ? theme.active : theme.hover
              }`}
              title={tool.label}
            >
              {tool.icon}
            </button>
          ))}
        </div>
      </Section>

      {/* Brush Settings */}
      {(activeTool === 'brush' || activeTool === 'eraser') && (
        <Section title="Brush Settings">
          {/* Brush Types */}
          {activeTool === 'brush' && (
            <div className="grid grid-cols-3 gap-1 mb-3">
              {brushTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setBrushType(type)}
                  className={`p-1.5 rounded text-xs transition-all ${
                    brushType.id === type.id ? theme.active : theme.hover
                  }`}
                  title={type.name}
                >
                  {type.icon}
                </button>
              ))}
            </div>
          )}

          {/* Size */}
          <Slider
            label="Size"
            value={brushSize}
            min={1}
            max={100}
            onChange={setBrushSize}
            unit="px"
            darkMode={darkMode}
          />

          {/* Stabilization */}
          <Slider
            label="Stabilization"
            value={brushStabilization}
            min={0}
            max={4}
            onChange={setBrushStabilization}
            darkMode={darkMode}
          />

          {/* Lazy Brush */}
          <div className={`p-2 rounded-lg ${theme.section}`}>
            <label className="flex items-center justify-between cursor-pointer">
              <span className={`text-xs ${theme.text}`}>Lazy Brush (Precision)</span>
              <input
                type="checkbox"
                checked={lazyBrushEnabled}
                onChange={(e) => setLazyBrushEnabled(e.target.checked)}
                className="w-4 h-4 rounded"
              />
            </label>
            {lazyBrushEnabled && (
              <div className="mt-2">
                <Slider
                  label="String Length"
                  value={lazyBrushRadius}
                  min={10}
                  max={100}
                  onChange={setLazyBrushRadius}
                  unit="px"
                  darkMode={darkMode}
                />
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Shape Settings */}
      {activeTool === 'shape' && (
        <Section title="Shape Settings">
          <div className="grid grid-cols-4 gap-1 mb-3">
            {shapeTools.map(shape => (
              <button
                key={shape.id}
                onClick={() => setShapeType(shape)}
                className={`p-2 rounded text-lg transition-all ${
                  shapeType.id === shape.id ? theme.active : theme.hover
                }`}
                title={shape.name}
              >
                {shape.icon}
              </button>
            ))}
          </div>

          <label className="flex items-center justify-between cursor-pointer">
            <span className={`text-xs ${theme.text}`}>Fill Shape</span>
            <input
              type="checkbox"
              checked={shapeFill}
              onChange={(e) => setShapeFill(e.target.checked)}
              className="w-4 h-4 rounded"
            />
          </label>
        </Section>
      )}

      {/* Symmetry */}
      <Section title="Symmetry Mode">
        <div className="grid grid-cols-5 gap-1">
          {symmetryModes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setSymmetryMode(mode)}
              className={`p-1.5 rounded text-sm transition-all ${
                symmetryMode.id === mode.id ? theme.active : theme.hover
              }`}
              title={mode.name}
            >
              {mode.icon}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}
