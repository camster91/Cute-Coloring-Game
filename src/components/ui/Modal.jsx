import { useEffect, useState } from 'react';

/**
 * Unified modal component with glassmorphism and animations
 * @param {Object} props
 * @param {boolean} props.isOpen - Open state
 * @param {function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {string} props.size - 'sm' | 'md' | 'lg' | 'xl' | 'full'
 * @param {boolean} props.darkMode - Dark mode state
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Footer content
 * @param {boolean} props.showCloseButton - Show close button in header
 * @param {string} props.variant - 'default' | 'glass'
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  darkMode = false,
  children,
  footer,
  showCloseButton = true,
  variant = 'default',
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Handle open/close animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  const isGlass = variant === 'glass';

  const theme = {
    bg: isGlass
      ? (darkMode ? 'bg-gray-900/80 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl')
      : (darkMode ? 'bg-gray-800' : 'bg-white'),
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500',
    border: isGlass
      ? (darkMode ? 'border-white/10' : 'border-gray-200/50')
      : (darkMode ? 'border-gray-700' : 'border-gray-200'),
    headerBg: isGlass
      ? 'bg-transparent'
      : (darkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'),
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-200 ease-out
        ${isAnimating ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0'}
      `}
      onClick={onClose}
    >
      <div
        className={`
          w-full ${sizeClasses[size]} rounded-2xl
          ${theme.bg} ${theme.text}
          border ${theme.border}
          shadow-2xl
          transition-all duration-200 ease-out
          ${isAnimating
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'
          }
        `}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: darkMode
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={`
            flex items-center justify-between px-5 py-4
            border-b ${theme.border} ${theme.headerBg}
            rounded-t-2xl
          `}>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className={`
                  w-8 h-8 rounded-xl flex items-center justify-center
                  transition-all duration-150
                  ${darkMode
                    ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'
                  }
                  hover:scale-105 active:scale-95
                `}
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`
          p-5 max-h-[70vh] overflow-y-auto
          scrollbar-thin
          ${darkMode ? 'scrollbar-thumb-gray-600' : 'scrollbar-thumb-gray-300'}
        `}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`
            px-5 py-4 border-t ${theme.border}
            flex items-center justify-end gap-3
            rounded-b-2xl ${theme.headerBg}
          `}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
