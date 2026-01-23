import { useEffect } from 'react';

/**
 * Unified modal component
 * @param {Object} props
 * @param {boolean} props.isOpen - Open state
 * @param {function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {string} props.size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} props.darkMode - Dark mode state
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Footer content
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  darkMode = false,
  children,
  footer,
}) {
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

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const theme = {
    bg: darkMode ? 'bg-gray-800' : 'bg-white',
    text: darkMode ? 'text-gray-200' : 'text-gray-800',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    overlay: 'bg-black/50',
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme.overlay}`}
      onClick={onClose}
    >
      <div
        className={`
          w-full ${sizeClasses[size]} rounded-xl shadow-2xl
          ${theme.bg} ${theme.text}
          transform transition-all
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className={`flex items-center justify-between px-4 py-3 border-b ${theme.border}`}>
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`px-4 py-3 border-t ${theme.border} flex justify-end gap-2`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
