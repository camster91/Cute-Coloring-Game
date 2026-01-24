import { ColorSwatch, Slider } from '../ui';

/**
 * Colors panel with palettes, harmony, and picker
 * Enhanced with better visual design
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
    border: darkMode ? 'border-gray-700/50' : 'border-gray-200/80',
    hover: darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100',
    active: darkMode
      ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/20 text-white'
      : 'bg-gradient-to-br from-indigo-100 to-purple-50 text-indigo-700',
    section: darkMode ? 'bg-gray-800/50' : 'bg-gray-50/80',
    sectionBorder: darkMode ? 'border-gray-700/30' : 'border-gray-200/50',
    input: darkMode
      ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400',
  };

  const Section = ({ title, children, action }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className={`
          text-[10px] font-semibold uppercase tracking-wider
          ${theme.textMuted}
        `}>
          {title}
        </h4>
        {action}
      </div>
      {children}
    </div>
  );

  const paletteNames = Object.keys(colorPalettes);

  return (
    <div className="space-y-5">
      {/* Current Color Preview */}
      <Section title="Current Color">
        <div className={`flex items-center gap-4 p-3 rounded-xl ${theme.section} border ${theme.sectionBorder}`}>
          {/* Large color preview */}
          <div className="relative">
            <div
              className="w-16 h-16 rounded-xl shadow-lg ring-2 ring-white/20"
              style={{
                backgroundColor: selectedColor,
                opacity: colorOpacity,
                boxShadow: `0 4px 20px ${selectedColor}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
              }}
            />
            {/* Checkerboard for transparency */}
            <div
              className="absolute inset-0 rounded-xl -z-10"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #ccc 25%, transparent 25%),
                  linear-gradient(-45deg, #ccc 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #ccc 75%),
                  linear-gradient(-45deg, transparent 75%, #ccc 75%)
                `,
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
              }}
            />
          </div>

          <div className="flex-1 space-y-2">
            {/* Hex Input */}
            <div className="relative">
              <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono ${theme.textMuted}`}>
                #
              </span>
              <input
                type="text"
                value={hexInput.replace('#', '')}
                onChange={(e) => onHexChange('#' + e.target.value)}
                className={`
                  w-full pl-6 pr-3 py-2 text-xs font-mono rounded-lg border
                  ${theme.input}
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                  transition-all duration-200
                `}
                placeholder="RRGGBB"
                maxLength={6}
              />
            </div>

            {/* Opacity Slider */}
            <Slider
              label="Opacity"
              value={Math.round(colorOpacity * 100)}
              min={0}
              max={100}
              onChange={(v) => setColorOpacity(v / 100)}
              unit="%"
              darkMode={darkMode}
            />
          </div>
        </div>
      </Section>

      {/* Palette Selector */}
      <Section title="Palette">
        {/* Palette Pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {paletteNames.map(name => (
            <button
              key={name}
              onClick={() => setCurrentPalette(name)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-lg
                transition-all duration-200
                ${currentPalette === name
                  ? theme.active
                  : `${theme.hover} ${theme.textMuted}`
                }
              `}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </button>
          ))}
        </div>

        {/* Color Grid */}
        <div className={`grid grid-cols-6 gap-1.5 p-2.5 rounded-xl ${theme.section} border ${theme.sectionBorder}`}>
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
          <div className={`flex flex-wrap gap-1.5 p-2 rounded-xl ${theme.section} border ${theme.sectionBorder}`}>
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
            className={`
              text-[10px] px-2.5 py-1 rounded-md font-medium
              transition-all duration-200
              ${showColorHarmony
                ? theme.active
                : `${theme.hover} ${theme.textMuted}`
              }
            `}
          >
            {showColorHarmony ? 'Hide' : 'Show'}
          </button>
        }
      >
        {showColorHarmony && (
          <div className={`p-3 rounded-xl ${theme.section} border ${theme.sectionBorder} space-y-3`}>
            {/* Harmony Type Selector */}
            <select
              value={selectedHarmony}
              onChange={(e) => setSelectedHarmony(e.target.value)}
              className={`
                w-full px-3 py-2 text-xs rounded-lg border
                ${theme.input}
                focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                transition-all duration-200
                appearance-none cursor-pointer
              `}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${darkMode ? '%23999' : '%23666'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundPosition: 'right 8px center',
                backgroundSize: '16px',
                backgroundRepeat: 'no-repeat',
                paddingRight: '32px',
              }}
            >
              {colorHarmonyTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name} — {type.description}
                </option>
              ))}
            </select>

            {/* Harmony Colors */}
            <div className="flex flex-wrap gap-2 justify-center">
              {harmonyColors.map((color, i) => (
                <div key={`harmony-${i}`} className="flex flex-col items-center gap-1">
                  <ColorSwatch
                    color={color}
                    selected={selectedColor === color}
                    size="lg"
                    onClick={() => setSelectedColor(color)}
                    label={`Harmony color ${i + 1}`}
                  />
                  <span className={`text-[9px] font-mono ${theme.textMuted}`}>
                    {color.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
