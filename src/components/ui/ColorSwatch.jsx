/**
 * Color swatch button with selection state
 * @param {Object} props
 * @param {string} props.color - Hex color value
 * @param {boolean} props.selected - Selection state
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {function} props.onClick - Click handler
 * @param {string} props.label - Accessible label
 * @param {boolean} props.showCheckmark - Show checkmark when selected
 */
export default function ColorSwatch({
  color,
  selected = false,
  size = 'md',
  onClick,
  label,
  showCheckmark = true,
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const checkmarkSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Determine if color is light for contrast
  const isLightColor = () => {
    if (!color || color === 'transparent') return true;
    const hex = color.replace('#', '');
    if (hex.length < 6) return true;
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  const lightColor = isLightColor();

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        relative rounded-xl transition-all duration-200 cursor-pointer
        flex items-center justify-center
        ${selected
          ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110 shadow-lg'
          : 'hover:scale-110 hover:shadow-md active:scale-100'
        }
        ${lightColor ? 'border border-slate-200/60' : ''}
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${className}
      `}
      style={{
        backgroundColor: color,
        boxShadow: selected ? `0 4px 14px ${color}40` : undefined,
      }}
      title={label || color}
      aria-label={label || `Select color ${color}`}
    >
      {/* Checkmark for selected state */}
      {selected && showCheckmark && (
        <span className={`
          ${checkmarkSizes[size]} font-bold
          ${lightColor ? 'text-slate-700' : 'text-white'}
          drop-shadow-sm
        `}>
          ✓
        </span>
      )}

      {/* Subtle inner highlight for depth */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
          }}
        />
      </div>
    </button>
  );
}
