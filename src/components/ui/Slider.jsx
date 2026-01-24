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
 * @param {string} props.variant - 'default' | 'compact' | 'gradient'
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
  variant = 'default',
  className = '',
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  const theme = {
    text: darkMode ? 'text-slate-200' : 'text-slate-700',
    textMuted: darkMode ? 'text-slate-400' : 'text-slate-500',
    badge: darkMode ? 'bg-slate-700/80 text-slate-300' : 'bg-slate-100 text-slate-600',
    track: darkMode ? 'rgba(51, 65, 85, 0.8)' : 'rgba(226, 232, 240, 0.8)',
  };

  const gradients = {
    default: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
    warm: 'linear-gradient(90deg, #f59e0b, #ef4444)',
    cool: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
    nature: 'linear-gradient(90deg, #10b981, #059669)',
  };

  const fillGradient = gradients[variant] || gradients.default;

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <label className={`text-xs font-medium tracking-wide ${theme.text}`}>
              {label}
            </label>
          )}
          {showValue && (
            <span className={`
              text-xs font-mono tabular-nums px-2 py-0.5 rounded-md
              ${theme.badge}
              transition-all duration-200
            `}>
              {value}{unit}
            </span>
          )}
        </div>
      )}
      <div className="relative group py-1">
        {/* Track background with subtle inner shadow */}
        <div
          className={`
            absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full
            ${darkMode ? 'bg-slate-700/60' : 'bg-slate-200/80'}
            shadow-inner
          `}
        />

        {/* Filled track with gradient */}
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 h-2 rounded-full transition-all duration-100"
          style={{
            width: `${percentage}%`,
            background: fillGradient,
            boxShadow: darkMode
              ? '0 0 12px rgba(99, 102, 241, 0.3)'
              : '0 0 8px rgba(99, 102, 241, 0.2)',
          }}
        />

        {/* Actual input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="
            relative w-full h-2 bg-transparent appearance-none cursor-pointer z-10
            focus:outline-none

            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-indigo-500
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:shadow-indigo-500/30
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:hover:shadow-xl
            [&::-webkit-slider-thumb]:hover:shadow-indigo-500/40
            [&::-webkit-slider-thumb]:hover:border-indigo-600
            [&::-webkit-slider-thumb]:active:scale-100
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing

            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-indigo-500
            [&::-moz-range-thumb]:shadow-lg
            [&::-moz-range-thumb]:shadow-indigo-500/30
            [&::-moz-range-thumb]:transition-all
            [&::-moz-range-thumb]:duration-150
            [&::-moz-range-thumb]:cursor-grab
            [&::-moz-range-thumb]:active:cursor-grabbing

            [&::-moz-range-track]:bg-transparent
          "
        />

        {/* Floating tooltip */}
        <div
          className={`
            absolute -top-9 px-2.5 py-1 text-xs font-medium text-white
            bg-slate-800 dark:bg-slate-700 rounded-lg shadow-xl
            opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100
            transition-all duration-200
            pointer-events-none
            before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2
            before:border-4 before:border-transparent before:border-t-slate-800
            dark:before:border-t-slate-700
          `}
          style={{
            left: `calc(${percentage}% - 20px)`,
          }}
        >
          {value}{unit}
        </div>
      </div>
    </div>
  );
}
