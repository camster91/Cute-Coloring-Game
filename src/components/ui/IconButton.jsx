/**
 * Reusable icon button with consistent styling and micro-interactions
 * @param {Object} props
 * @param {string} props.icon - Emoji or icon
 * @param {string} props.label - Accessible label
 * @param {boolean} props.active - Active state
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {boolean} props.darkMode - Dark mode state
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional classes
 * @param {boolean} props.pulse - Show pulse animation when active
 */
export default function IconButton({
  icon,
  label,
  active = false,
  disabled = false,
  size = 'md',
  darkMode = false,
  onClick,
  className = '',
  pulse = false,
  ...props
}) {
  const sizeClasses = {
    sm: 'p-1 text-sm min-w-[28px] min-h-[28px]',
    md: 'p-1.5 text-base min-w-[36px] min-h-[36px]',
    lg: 'p-2 text-lg min-w-[44px] min-h-[44px]',
  };

  const theme = {
    base: darkMode ? 'text-gray-200' : 'text-gray-700',
    hover: darkMode ? 'hover:bg-gray-700 hover:scale-105' : 'hover:bg-gray-100 hover:scale-105',
    active: darkMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-indigo-100 text-indigo-700 shadow-md shadow-indigo-200/50',
    disabled: 'opacity-30 cursor-not-allowed',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-lg
        transition-all duration-200 ease-out
        transform active:scale-95
        flex items-center justify-center
        ${sizeClasses[size]}
        ${theme.base}
        ${disabled ? theme.disabled : active ? theme.active : theme.hover}
        ${active && pulse ? 'animate-pulseGlow' : ''}
        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-1
        ${darkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
        ${className}
      `}
      title={label}
      aria-label={label}
      {...props}
    >
      <span className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
        {icon}
      </span>
    </button>
  );
}
