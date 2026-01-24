import { Slider } from '../ui';

/**
 * Tools panel containing brush, shape, and symmetry controls
 * Enhanced with better visual design
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
  // Touch settings
  palmRejection,
  setPalmRejection,
  // Text settings
  fontSize,
  setFontSize,
  fontFamilies,
  fontFamily,
  setFontFamily,
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
    border: darkMode ? 'border-gray-700/50' : 'border-gray-200/80',
    hover: darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100',
    active: darkMode
      ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/20 text-white ring-1 ring-indigo-400/30'
      : 'bg-gradient-to-br from-indigo-100 to-purple-50 text-indigo-700 ring-1 ring-indigo-200',
    section: darkMode ? 'bg-gray-800/50' : 'bg-gray-50/80',
    sectionBorder: darkMode ? 'border-gray-700/30' : 'border-gray-200/50',
  };

  const Section = ({ title, children, className = '' }) => (
    <div className={`space-y-3 ${className}`}>
      <h4 className={`
        text-[10px] font-semibold uppercase tracking-wider
        ${theme.textMuted}
        flex items-center gap-2
      `}>
        <span className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
        {title}
        <span className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
      </h4>
      {children}
    </div>
  );

  const ToolButton = ({ icon, label, isActive, onClick, size = 'md' }) => {
    const sizeClasses = {
      sm: 'p-1.5 text-sm',
      md: 'p-2.5 text-lg',
      lg: 'p-3 text-xl',
    };
    return (
      <button
        onClick={onClick}
        className={`
          ${sizeClasses[size]} rounded-xl
          transition-all duration-200 ease-out
          flex items-center justify-center
          ${isActive
            ? `${theme.active} scale-105 shadow-sm`
            : `${theme.hover} hover:scale-105 active:scale-95`
          }
        `}
        title={label}
      >
        <span className={`${isActive ? 'drop-shadow-sm' : ''}`}>{icon}</span>
      </button>
    );
  };

  const Toggle = ({ label, checked, onChange }) => (
    <label className={`
      flex items-center justify-between p-3 rounded-xl cursor-pointer
      ${theme.section} border ${theme.sectionBorder}
      transition-all duration-200
      hover:shadow-sm
    `}>
      <span className={`text-xs font-medium ${theme.text}`}>{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className={`
          w-10 h-5 rounded-full transition-all duration-200
          ${checked
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
            : (darkMode ? 'bg-gray-600' : 'bg-gray-300')
          }
        `} />
        <div className={`
          absolute top-0.5 left-0.5 w-4 h-4 rounded-full
          bg-white shadow-sm
          transition-transform duration-200 ease-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `} />
      </div>
    </label>
  );

  return (
    <div className="space-y-5">
      {/* Primary Tools */}
      <Section title="Tools">
        <div className={`grid grid-cols-5 gap-2 p-2 rounded-xl ${theme.section} border ${theme.sectionBorder}`}>
          {[
            { id: 'brush', icon: '🖌️', label: 'Brush' },
            { id: 'eraser', icon: '🧽', label: 'Eraser' },
            { id: 'fill', icon: '🪣', label: 'Fill' },
            { id: 'shape', icon: '⬜', label: 'Shapes' },
            { id: 'text', icon: '🔤', label: 'Text' },
          ].map(tool => (
            <ToolButton
              key={tool.id}
              icon={tool.icon}
              label={tool.label}
              isActive={activeTool === tool.id}
              onClick={() => setActiveTool(tool.id)}
            />
          ))}
        </div>
      </Section>

      {/* Brush Settings */}
      {(activeTool === 'brush' || activeTool === 'eraser') && (
        <Section title="Brush Settings">
          {/* Brush Types */}
          {activeTool === 'brush' && (
            <div className={`grid grid-cols-3 gap-1.5 p-2 rounded-xl ${theme.section} border ${theme.sectionBorder}`}>
              {brushTypes.map(type => (
                <ToolButton
                  key={type.id}
                  icon={type.icon}
                  label={type.name}
                  isActive={brushType.id === type.id}
                  onClick={() => setBrushType(type)}
                  size="sm"
                />
              ))}
            </div>
          )}

          {/* Size Slider */}
          <div className={`p-3 rounded-xl ${theme.section} border ${theme.sectionBorder}`}>
            <Slider
              label="Size"
              value={brushSize}
              min={1}
              max={100}
              onChange={setBrushSize}
              unit="px"
              darkMode={darkMode}
              showPreview
            />
          </div>

          {/* Stabilization */}
          <div className={`p-3 rounded-xl ${theme.section} border ${theme.sectionBorder}`}>
            <Slider
              label="Stabilization"
              value={brushStabilization}
              min={0}
              max={4}
              onChange={setBrushStabilization}
              darkMode={darkMode}
            />
          </div>

          {/* Lazy Brush */}
          <div className="space-y-2">
            <Toggle
              label="Lazy Brush (Precision)"
              checked={lazyBrushEnabled}
              onChange={setLazyBrushEnabled}
            />
            {lazyBrushEnabled && (
              <div className={`p-3 rounded-xl ${theme.section} border ${theme.sectionBorder} ml-2`}>
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

          {/* Palm Rejection */}
          <Toggle
            label="Palm Rejection"
            checked={palmRejection}
            onChange={setPalmRejection}
          />
        </Section>
      )}

      {/* Shape Settings */}
      {activeTool === 'shape' && (
        <Section title="Shape Settings">
          <div className={`grid grid-cols-4 gap-2 p-2 rounded-xl ${theme.section} border ${theme.sectionBorder}`}>
            {shapeTools.map(shape => (
              <ToolButton
                key={shape.id}
                icon={shape.icon}
                label={shape.name}
                isActive={shapeType.id === shape.id}
                onClick={() => setShapeType(shape)}
              />
            ))}
          </div>

          <Toggle
            label="Fill Shape"
            checked={shapeFill}
            onChange={setShapeFill}
          />
        </Section>
      )}

      {/* Text Settings */}
      {activeTool === 'text' && (
        <Section title="Text Settings">
          <div className={`p-3 rounded-xl ${theme.section} border ${theme.sectionBorder}`}>
            <Slider
              label="Font Size"
              value={fontSize}
              min={8}
              max={72}
              onChange={setFontSize}
              unit="px"
              darkMode={darkMode}
            />
          </div>

          <div className={`p-2 rounded-xl ${theme.section} border ${theme.sectionBorder}`}>
            <label className={`text-xs ${theme.textMuted} mb-2 block`}>Font Family</label>
            <div className="grid grid-cols-1 gap-1">
              {fontFamilies?.map(font => (
                <button
                  key={font.id}
                  onClick={() => setFontFamily(font)}
                  className={`
                    p-2 rounded-lg text-sm text-left transition-all
                    ${fontFamily?.id === font.id
                      ? `${theme.active}`
                      : `${theme.hover}`
                    }
                  `}
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>

          <div className={`p-3 rounded-xl ${theme.section} border ${theme.sectionBorder}`}>
            <p className={`text-xs ${theme.textMuted}`}>
              Click on the canvas to add text. Press Enter to confirm.
            </p>
          </div>
        </Section>
      )}

      {/* Symmetry */}
      <Section title="Symmetry Mode">
        <div className={`grid grid-cols-5 gap-1.5 p-2 rounded-xl ${theme.section} border ${theme.sectionBorder}`}>
          {symmetryModes.map(mode => (
            <ToolButton
              key={mode.id}
              icon={mode.icon}
              label={mode.name}
              isActive={symmetryMode.id === mode.id}
              onClick={() => setSymmetryMode(mode)}
              size="sm"
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
