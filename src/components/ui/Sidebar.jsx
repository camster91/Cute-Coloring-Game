import { useState } from 'react';

/**
 * Collapsible sidebar component
 * @param {Object} props
 * @param {string} props.position - 'left' | 'right'
 * @param {boolean} props.collapsed - Collapsed state
 * @param {function} props.onToggle - Toggle handler
 * @param {boolean} props.darkMode - Dark mode state
 * @param {React.ReactNode} props.children - Sidebar content
 * @param {string} props.width - Width when expanded (default: w-56)
 */
export default function Sidebar({
  position = 'left',
  collapsed = false,
  onToggle,
  darkMode = false,
  children,
  width = 'w-56',
  className = '',
}) {
  const theme = {
    bg: darkMode ? 'bg-gray-800' : 'bg-white',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
  };

  const positionClasses = position === 'left'
    ? 'left-0 border-r'
    : 'right-0 border-l';

  const toggleIcon = position === 'left'
    ? (collapsed ? '→' : '←')
    : (collapsed ? '←' : '→');

  return (
    <aside
      className={`
        flex flex-col h-full ${theme.bg} ${theme.border} ${positionClasses}
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-0 overflow-hidden' : width}
        ${className}
      `}
    >
      {/* Toggle button */}
      {onToggle && (
        <button
          onClick={onToggle}
          className={`
            absolute top-1/2 -translate-y-1/2
            ${position === 'left' ? '-right-3' : '-left-3'}
            w-6 h-12 rounded-full shadow-md
            ${theme.bg} ${theme.border} border
            flex items-center justify-center
            ${theme.hover} transition-colors z-10
          `}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="text-xs">{toggleIcon}</span>
        </button>
      )}

      {/* Content */}
      <div className={`flex-1 overflow-hidden ${collapsed ? 'invisible' : 'visible'}`}>
        {children}
      </div>
    </aside>
  );
}
