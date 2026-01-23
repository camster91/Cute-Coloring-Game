/**
 * Reusable icon button with consistent styling and micro-interactions
 * @param {Object} props
 * @param {string} props.icon - Emoji or icon
 * @param {string} props.label - Accessible label
 * @param {boolean} props.active - Active state
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {string} props.variant - 'default' | 'ghost' | 'tool'
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
  variant = 'default',
  darkMode = false,
  onClick,
  className = '',
  pulse = false,
  ...props
}) {
  const sizeClasses = {
    sm: 'p-1.5 text-sm min-w-[32px] min-h-[32px]',
    md: 'p-2 text-base min-w-[40px] min-h-[40px]',
    lg: 'p-2.5 text-lg min-w-[48px] min-h-[48px]',
  };

  const baseStyles = `
    rounded-xl
    transition-all duration-200 ease-out
    transform active:scale-95
    flex items-center justify-center
    backdrop-blur-sm
    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2
    ${darkMode ? 'focus:ring-offset-slate-800' : 'focus:ring-offset-white'}
  `;

  const variantStyles = {
    default: {
      base: darkMode ? 'text-slate-300' : 'text-slate-600',
      hover: darkMode
        ? 'hover:bg-slate-700/70 hover:text-white hover:shadow-lg hover:shadow-slate-900/20'
        : 'hover:bg-white hover:text-slate-900 hover:shadow-lg hover:shadow-slate-200/50',
      active: darkMode
        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-indigo-400/30'
        : 'bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 shadow-lg shadow-indigo-200/50 ring-1 ring-indigo-200',
    },
    ghost: {
      base: darkMode ? 'text-slate-400' : 'text-slate-500',
      hover: darkMode
        ? 'hover:bg-slate-700/50 hover:text-slate-200'
        : 'hover:bg-slate-100/80 hover:text-slate-700',
      active: darkMode
        ? 'bg-slate-700/70 text-indigo-400'
        : 'bg-indigo-50/80 text-indigo-600',
    },
    tool: {
      base: darkMode ? 'text-slate-400' : 'text-slate-600',
      hover: darkMode
        ? 'hover:bg-slate-700/60 hover:text-white'
        : 'hover:bg-white hover:text-slate-800 hover:shadow-md',
      active: darkMode
        ? 'bg-gradient-to-br from-indigo-600/90 to-purple-600/90 text-white shadow-xl shadow-indigo-500/25 ring-1 ring-white/10'
        : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-xl shadow-indigo-300/40',
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.default;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${sizeClasses[size]}
        ${currentVariant.base}
        ${disabled
          ? 'opacity-30 cursor-not-allowed'
          : active
            ? currentVariant.active
            : currentVariant.hover
        }
        ${active && pulse ? 'animate-pulseGlow' : ''}
        ${className}
      `}
      title={label}
      aria-label={label}
      {...props}
    >
      <span className={`
        transition-all duration-200
        ${active ? 'scale-110' : 'group-hover:scale-105'}
        ${active && variant === 'tool' ? 'drop-shadow-sm' : ''}
      `}>
        {icon}
      </span>
    </button>
  );
}
