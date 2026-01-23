/**
 * Color swatch button with selection state
 * @param {Object} props
 * @param {string} props.color - Hex color value
 * @param {boolean} props.selected - Selection state
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {function} props.onClick - Click handler
 * @param {string} props.label - Accessible label
 */
export default function ColorSwatch({
  color,
  selected = false,
  size = 'md',
  onClick,
  label,
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const ringClasses = {
    sm: 'ring-2 ring-offset-1',
    md: 'ring-2 ring-offset-2',
    lg: 'ring-3 ring-offset-2',
  };

  // Determine if color is light for contrast
  const isLightColor = () => {
    if (!color || color === 'transparent') return true;
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        rounded-lg border transition-all cursor-pointer
        ${selected ? `${ringClasses[size]} ring-indigo-500` : 'hover:scale-110'}
        ${isLightColor() ? 'border-gray-300' : 'border-transparent'}
        ${className}
      `}
      style={{ backgroundColor: color }}
      title={label || color}
      aria-label={label || `Select color ${color}`}
    />
  );
}
