import { ColorSwatch, Slider } from '../ui';

/**
 * Colors panel with palettes, harmony, and picker
 */
export default function ColorsPanel({
  // Palette state
  colorPalettes,
  currentPalette,
  setCurrentPalette,
  selectedColor,
  setSelectedColor,
  colorOpacity,
  setColorOpacity,
  // Hex input
  hexInput,
  setHexInput,
  onHexChange,
  // Recent colors
  recentColors,
  // Color harmony
  showColorHarmony,
  setShowColorHarmony,
  colorHarmonyTypes,
  selectedHarmony,
  setSelectedHarmony,
  harmonyColors,
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

  const Section = ({ title, children, action }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h4 className={`text-xs font-semibold uppercase tracking-wide ${theme.textMuted}`}>
          {title}
        </h4>
        {action}
      </div>
      {children}
    </div>
  );

  const paletteNames = Object.keys(colorPalettes);

  return (
    <div className="space-y-4">
      {/* Current Color Preview */}
      <Section title="Current Color">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-inner"
            style={{ backgroundColor: selectedColor, opacity: colorOpacity }}
          />
          <div className="flex-1">
            <input
              type="text"
              value={hexInput}
              onChange={(e) => onHexChange(e.target.value)}
              className={`w-full px-2 py-1 text-xs font-mono rounded border ${theme.input}`}
              placeholder="#RRGGBB"
            />
            <Slider
              value={Math.round(colorOpacity * 100)}
              min={0}
              max={100}
              onChange={(v) => setColorOpacity(v / 100)}
              unit="%"
              darkMode={darkMode}
              className="mt-1"
            />
          </div>
        </div>
      </Section>

      {/* Palette Selector */}
      <Section title="Palette">
        <select
          value={currentPalette}
          onChange={(e) => setCurrentPalette(e.target.value)}
          className={`w-full px-2 py-1.5 text-xs rounded border ${theme.input}`}
        >
          {paletteNames.map(name => (
            <option key={name} value={name}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </option>
          ))}
        </select>

        {/* Color Grid */}
        <div className="grid grid-cols-6 gap-1 mt-2">
          {colorPalettes[currentPalette]?.map((color, i) => (
            <ColorSwatch
              key={`${color}-${i}`}
              color={color}
              selected={selectedColor === color}
              size="md"
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
      </Section>

      {/* Recent Colors */}
      {recentColors.length > 0 && (
        <Section title="Recent">
          <div className="flex flex-wrap gap-1">
            {recentColors.map((color, i) => (
              <ColorSwatch
                key={`recent-${i}`}
                color={color}
                selected={selectedColor === color}
                size="sm"
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Color Harmony */}
      <Section
        title="Color Harmony"
        action={
          <button
            onClick={() => setShowColorHarmony(!showColorHarmony)}
            className={`text-xs px-2 py-0.5 rounded ${showColorHarmony ? theme.active : theme.hover}`}
          >
            {showColorHarmony ? 'Hide' : 'Show'}
          </button>
        }
      >
        {showColorHarmony && (
          <div className={`p-2 rounded-lg ${theme.section}`}>
            <select
              value={selectedHarmony}
              onChange={(e) => setSelectedHarmony(e.target.value)}
              className={`w-full px-2 py-1 text-xs rounded border mb-2 ${theme.input}`}
            >
              {colorHarmonyTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name} - {type.description}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-1">
              {harmonyColors.map((color, i) => (
                <ColorSwatch
                  key={`harmony-${i}`}
                  color={color}
                  selected={selectedColor === color}
                  size="md"
                  onClick={() => setSelectedColor(color)}
                  label={`Harmony color ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
