import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Mobile-friendly bottom sheet with drag handle and snap points
 * @param {Object} props
 * @param {boolean} props.isOpen - Open state
 * @param {function} props.onClose - Close handler
 * @param {string} props.title - Sheet title
 * @param {boolean} props.darkMode - Dark mode state
 * @param {React.ReactNode} props.children - Sheet content
 * @param {string} props.snapPoint - 'closed' | 'half' | 'full'
 * @param {function} props.onSnapChange - Callback when snap point changes
 */
export default function BottomSheet({
  isOpen,
  onClose,
  title,
  darkMode = false,
  children,
  snapPoint = 'half',
  onSnapChange,
}) {
  const [currentSnap, setCurrentSnap] = useState(snapPoint);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const sheetRef = useRef(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);

  const theme = {
    bg: darkMode ? 'bg-gray-800' : 'bg-white',
    text: darkMode ? 'text-gray-200' : 'text-gray-800',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    handle: darkMode ? 'bg-gray-600' : 'bg-gray-300',
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
      {/* Backdrop */}
      {currentSnap !== 'closed' && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          style={{ opacity: currentSnap === 'full' ? 0.5 : 0.3 }}
          onClick={onClose}
        />
      )}

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`fixed left-0 right-0 bottom-0 ${theme.bg} rounded-t-2xl shadow-2xl z-50 transition-all duration-300 ease-out`}
        style={{
          height: `${height}vh`,
          transform: `translateY(${translateY}px)`,
          maxHeight: '90vh',
        }}
      >
        {/* Drag Handle */}
        <div
          className="flex flex-col items-center pt-2 pb-1 cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className={`w-10 h-1 rounded-full ${theme.handle}`} />
        </div>

        {/* Header */}
        {title && (
          <div className={`flex items-center justify-between px-4 py-2 border-b ${theme.border}`}>
            <h3 className={`font-semibold ${theme.text}`}>{title}</h3>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: `calc(${height}vh - 60px)` }}>
          {children}
        </div>
      </div>
    </>
  );
}
