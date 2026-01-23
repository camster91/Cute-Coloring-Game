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
    track: darkMode ? 'bg-gray-700' : 'bg-gray-200',
    fill: 'bg-indigo-500',
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`space-y-1 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <label className={`text-xs font-medium ${theme.text}`}>
              {label}
            </label>
          )}
          {showValue && (
            <span className={`text-xs ${theme.textMuted}`}>
              {value}{unit}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #6366f1 ${percentage}%, ${darkMode ? '#374151' : '#e5e7eb'} ${percentage}%)`,
          }}
        />
      </div>
    </div>
  );
}
