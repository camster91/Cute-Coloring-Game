/**
 * Collapsible sidebar component with glassmorphism
 * @param {Object} props
 * @param {string} props.position - 'left' | 'right'
 * @param {boolean} props.collapsed - Collapsed state
 * @param {function} props.onToggle - Toggle handler
 * @param {boolean} props.darkMode - Dark mode state
 * @param {React.ReactNode} props.children - Sidebar content
 * @param {string} props.width - Width when expanded (default: w-64)
 * @param {string} props.variant - 'default' | 'glass'
 */
export default function Sidebar({
  position = 'left',
  collapsed = false,
  onToggle,
  darkMode = false,
  children,
  width = 'w-64',
  className = '',
  variant = 'default',
}) {
  const isGlass = variant === 'glass';

  const theme = {
    bg: isGlass
      ? (darkMode ? 'bg-gray-900/70 backdrop-blur-xl' : 'bg-white/70 backdrop-blur-xl')
      : (darkMode ? 'bg-gray-800' : 'bg-white'),
    border: isGlass
      ? (darkMode ? 'border-white/10' : 'border-gray-200/50')
      : (darkMode ? 'border-gray-700' : 'border-gray-200'),
    shadow: isGlass
      ? (darkMode ? 'shadow-xl shadow-black/20' : 'shadow-xl shadow-gray-200/50')
      : 'shadow-sm',
    toggleBg: darkMode
      ? 'bg-gray-800 hover:bg-gray-700'
      : 'bg-white hover:bg-gray-50',
    toggleBorder: darkMode ? 'border-gray-600' : 'border-gray-200',
    toggleIcon: darkMode ? 'text-gray-400' : 'text-gray-500',
  };

  const positionClasses = position === 'left'
    ? 'left-0 border-r'
    : 'right-0 border-l';

  return (
    <aside
      className={`
        relative flex flex-col h-full
        ${theme.bg} ${theme.border} ${theme.shadow}
        ${positionClasses}
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${collapsed ? 'w-0 overflow-hidden opacity-0' : `${width} opacity-100`}
        ${className}
      `}
    >
      {/* Toggle button */}
      {onToggle && (
        <button
          onClick={onToggle}
          className={`
            absolute top-1/2 -translate-y-1/2
            ${position === 'left' ? '-right-4' : '-left-4'}
            w-8 h-16
            ${theme.toggleBg} ${theme.toggleBorder}
            border shadow-md
            flex items-center justify-center
            transition-all duration-200 z-20
            hover:scale-105 active:scale-95
            ${position === 'left' ? 'rounded-r-xl' : 'rounded-l-xl'}
          `}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={`
              w-4 h-4 ${theme.toggleIcon}
              transition-transform duration-300
              ${collapsed
                ? (position === 'left' ? 'rotate-0' : 'rotate-180')
                : (position === 'left' ? 'rotate-180' : 'rotate-0')
              }
            `}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Content container with fade */}
      <div className={`
        flex-1 overflow-hidden
        transition-opacity duration-200
        ${collapsed ? 'opacity-0 invisible' : 'opacity-100 visible'}
      `}>
        {children}
      </div>

      {/* Decorative gradient accent */}
      {!collapsed && isGlass && (
        <div className={`
          absolute bottom-0 left-0 right-0 h-24
          pointer-events-none opacity-30
          ${position === 'left' ? 'bg-gradient-to-t' : 'bg-gradient-to-t'}
          ${darkMode
            ? 'from-indigo-500/20 to-transparent'
            : 'from-indigo-100 to-transparent'
          }
        `} />
      )}
    </aside>
  );
}
