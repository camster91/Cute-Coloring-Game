import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Mobile-friendly bottom sheet with glassmorphism, drag handle and snap points
 * @param {Object} props
 * @param {boolean} props.isOpen - Open state
 * @param {function} props.onClose - Close handler
 * @param {string} props.title - Sheet title
 * @param {boolean} props.darkMode - Dark mode state
 * @param {React.ReactNode} props.children - Sheet content
 * @param {string} props.snapPoint - 'closed' | 'half' | 'full'
 * @param {function} props.onSnapChange - Callback when snap point changes
 * @param {string} props.variant - 'default' | 'glass'
 */
export default function BottomSheet({
  isOpen,
  onClose,
  title,
  darkMode = false,
  children,
  snapPoint = 'half',
  onSnapChange,
  variant = 'default',
}) {
  const [currentSnap, setCurrentSnap] = useState(snapPoint);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const sheetRef = useRef(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  const isGlass = variant === 'glass';

  const theme = {
    bg: isGlass
      ? (darkMode ? 'bg-gray-900/90 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl')
      : (darkMode ? 'bg-gray-800' : 'bg-white'),
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500',
    border: isGlass
      ? (darkMode ? 'border-white/10' : 'border-gray-200/50')
      : (darkMode ? 'border-gray-700' : 'border-gray-200'),
    handle: darkMode ? 'bg-gray-500' : 'bg-gray-300',
    handleHover: darkMode ? 'group-hover:bg-gray-400' : 'group-hover:bg-gray-400',
  };

  const snapHeights = {
    closed: 0,
    half: 50,
    full: 85,
  };

  useEffect(() => {
    if (isOpen && currentSnap === 'closed') {
      setCurrentSnap('half');
    }
  }, [isOpen]);

  const handleDragStart = useCallback((e) => {
    setIsDragging(true);
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startYRef.current = clientY;
    currentYRef.current = clientY;
  }, []);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - currentYRef.current;
    currentYRef.current = clientY;

    setDragY(prev => prev + deltaY);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const totalDrag = currentYRef.current - startYRef.current;
    const threshold = 50;

    let newSnap = currentSnap;

    if (totalDrag > threshold) {
      // Dragged down
      if (currentSnap === 'full') newSnap = 'half';
      else if (currentSnap === 'half') {
        newSnap = 'closed';
        onClose?.();
      }
    } else if (totalDrag < -threshold) {
      // Dragged up
      if (currentSnap === 'half') newSnap = 'full';
      else if (currentSnap === 'closed') newSnap = 'half';
    }

    setCurrentSnap(newSnap);
    onSnapChange?.(newSnap);
    setDragY(0);
  }, [isDragging, currentSnap, onClose, onSnapChange]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);

      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (!isOpen && currentSnap === 'closed') return null;

  const height = snapHeights[currentSnap];
  const translateY = isDragging ? Math.max(0, dragY) : 0;

  return (
    <>
      {/* Backdrop with blur */}
      {currentSnap !== 'closed' && (
        <div
          className={`
            fixed inset-0 z-40
            transition-all duration-300 ease-out
            ${currentSnap === 'full' ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/30'}
          `}
          onClick={onClose}
        />
      )}

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`
          fixed left-0 right-0 bottom-0 z-50
          ${theme.bg} rounded-t-3xl
          border-t ${theme.border}
          transition-all ease-out
          ${isDragging ? 'duration-0' : 'duration-300'}
        `}
        style={{
          height: `${height}vh`,
          transform: `translateY(${translateY}px)`,
          maxHeight: '90vh',
          boxShadow: darkMode
            ? '0 -10px 40px -10px rgba(0, 0, 0, 0.5)'
            : '0 -10px 40px -10px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Drag Handle */}
        <div
          className="group flex flex-col items-center py-3 cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className={`
            w-12 h-1.5 rounded-full
            ${theme.handle} ${theme.handleHover}
            transition-all duration-200
            group-active:w-16 group-active:bg-indigo-400
          `} />
        </div>

        {/* Header */}
        {title && (
          <div className={`
            flex items-center justify-between px-5 py-3
            border-b ${theme.border}
          `}>
            <h3 className={`font-semibold text-lg ${theme.text}`}>{title}</h3>
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
              aria-label="Close sheet"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div
          className={`
            flex-1 overflow-y-auto p-5
            scrollbar-thin
            ${darkMode ? 'scrollbar-thumb-gray-600' : 'scrollbar-thumb-gray-300'}
          `}
          style={{ maxHeight: `calc(${height}vh - 80px)` }}
        >
          {children}
        </div>

        {/* Bottom safe area gradient */}
        <div className={`
          absolute bottom-0 left-0 right-0 h-8
          pointer-events-none
          bg-gradient-to-t ${darkMode ? 'from-gray-800' : 'from-white'} to-transparent
        `} />
      </div>
    </>
  );
}
