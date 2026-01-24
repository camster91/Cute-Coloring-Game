import { Slider, ColorSwatch } from '../ui';

/**
 * Canvas panel for background, grid, and export settings
 */
export default function CanvasPanel({
  // Background
  backgroundColor,
  setBackgroundColor,
  backgroundColors = ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#1a1a2e', '#16213e', '#0f0f23', '#FFF8E7', '#F0F4FF'],
  // Grid
  showGrid,
  setShowGrid,
  gridSize,
  setGridSize,
  snapToGrid,
  setSnapToGrid,
  // Export
  onExport,
  exportFormat,
  setExportFormat,
  exportQuality,
  setExportQuality,
  // Clear
  onClearCanvas,
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
    input: darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300',
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
      {/* Background */}
      <Section title="Background">
        <div className="flex flex-wrap gap-1">
          {backgroundColors.map((color) => (
            <ColorSwatch
              key={color}
              color={color}
              selected={backgroundColor === color}
              size="md"
              onClick={() => setBackgroundColor(color)}
              label={`Background: ${color}`}
            />
          ))}
        </div>
      </Section>

      {/* Grid Settings */}
      <Section title="Grid">
        <div className="flex items-center justify-between mb-2">
          <label className={`text-xs ${theme.text}`}>Show Grid</label>
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
            className="w-4 h-4"
          />
        </div>

        {showGrid && (
          <>
            <Slider
              label="Grid Size"
              value={gridSize}
              min={5}
              max={50}
              step={5}
              onChange={setGridSize}
              unit="px"
              darkMode={darkMode}
            />

            <div className="flex items-center justify-between">
              <label className={`text-xs ${theme.text}`}>Snap to Grid</label>
              <input
                type="checkbox"
                checked={snapToGrid}
                onChange={(e) => setSnapToGrid(e.target.checked)}
                className="w-4 h-4"
              />
            </div>
          </>
        )}
      </Section>

      {/* Export Settings */}
      <Section title="Export">
        <div className="grid grid-cols-3 gap-1 mb-2">
          {['png', 'jpg', 'svg'].map((format) => (
            <button
              key={format}
              onClick={() => setExportFormat(format)}
              className={`px-2 py-1.5 text-xs rounded uppercase ${
                exportFormat === format ? theme.active : theme.hover
              }`}
            >
              {format}
            </button>
          ))}
        </div>

        {exportFormat !== 'svg' && (
          <Slider
            label="Quality"
            value={exportQuality}
            min={1}
            max={4}
            onChange={setExportQuality}
            unit="x"
            darkMode={darkMode}
          />
        )}

        <button
          onClick={onExport}
          className={`w-full px-3 py-2 text-sm rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors`}
        >
          💾 Export Artwork
        </button>
      </Section>

      {/* Canvas Actions */}
      <Section title="Canvas Actions">
        <button
          onClick={onClearCanvas}
          className={`w-full px-3 py-2 text-sm rounded-lg ${theme.hover} border ${theme.border}`}
        >
          🗑 Clear Canvas
        </button>
      </Section>
    </div>
  );
}
