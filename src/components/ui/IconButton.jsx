/**
 * Reusable icon button with consistent styling
 * @param {Object} props
 * @param {string} props.icon - Emoji or icon
 * @param {string} props.label - Accessible label
 * @param {boolean} props.active - Active state
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {boolean} props.darkMode - Dark mode state
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional classes
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
  ...props
}) {
  const sizeClasses = {
    sm: 'p-1 text-sm',
    md: 'p-1.5 text-base',
    lg: 'p-2 text-lg',
  };

  const theme = {
    base: darkMode ? 'text-gray-200' : 'text-gray-700',
    hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    active: darkMode ? 'bg-gray-700 text-white' : 'bg-indigo-100 text-indigo-700',
    disabled: 'opacity-30 cursor-not-allowed',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-lg transition-all
        ${sizeClasses[size]}
        ${theme.base}
        ${disabled ? theme.disabled : active ? theme.active : theme.hover}
        ${className}
      `}
      title={label}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
}
