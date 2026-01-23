/**
 * Styled slider/range input with label and value display
 * @param {Object} props
 * @param {string} props.label - Label text
 * @param {number} props.value - Current value
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 * @param {number} props.step - Step increment
 * @param {function} props.onChange - Change handler
 * @param {string} props.unit - Unit suffix (e.g., 'px', '%')
 * @param {boolean} props.showValue - Show value display
 * @param {boolean} props.darkMode - Dark mode state
 */
export default function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  unit = '',
  showValue = true,
  darkMode = false,
  className = '',
}) {
  const theme = {
    text: darkMode ? 'text-gray-200' : 'text-gray-700',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500',
    track: darkMode ? '#374151' : '#e5e7eb',
    fill: '#6366f1',
    thumb: darkMode ? '#818cf8' : '#6366f1',
    thumbHover: darkMode ? '#a5b4fc' : '#4f46e5',
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <label className={`text-xs font-medium ${theme.text}`}>
              {label}
            </label>
          )}
          {showValue && (
            <span className={`text-xs font-mono tabular-nums ${theme.textMuted} bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded`}>
              {value}{unit}
            </span>
          )}
        </div>
      )}
      <div className="relative group">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="
            w-full h-2 rounded-full appearance-none cursor-pointer
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-indigo-500
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:shadow-indigo-500/30
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-200
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:hover:shadow-lg
            [&::-webkit-slider-thumb]:active:scale-95
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-indigo-500
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:transition-all
            [&::-moz-range-thumb]:duration-200
          "
          style={{
            background: `linear-gradient(to right, ${theme.fill} ${percentage}%, ${theme.track} ${percentage}%)`,
          }}
        />
        {/* Hover tooltip */}
        <div
          className="
            absolute -top-8 px-2 py-1 text-xs font-medium text-white
            bg-gray-800 rounded shadow-lg
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            pointer-events-none
          "
          style={{
            left: `calc(${percentage}% - 16px)`,
          }}
        >
          {value}{unit}
        </div>
      </div>
    </div>
  );
}
