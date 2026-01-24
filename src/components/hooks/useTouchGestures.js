import { useRef, useCallback, useEffect } from 'react';

/**
 * Hook for handling touch gestures
 * - Pinch-to-zoom
 * - Two-finger pan
 * - Two-finger tap for undo
 * - Three-finger tap for redo
 *
 * @param {Object} options
 * @param {function} options.onZoom - Callback for zoom changes (delta)
 * @param {function} options.onPan - Callback for pan changes ({x, y})
 * @param {function} options.onUndo - Callback for two-finger tap (undo)
 * @param {function} options.onRedo - Callback for three-finger tap (redo)
 * @param {React.RefObject} options.targetRef - Ref to the target element
 */
export default function useTouchGestures({ onZoom, onPan, onUndo, onRedo, targetRef }) {
  const touchStateRef = useRef({
    isMultiTouch: false,
    initialDistance: 0,
    initialCenter: { x: 0, y: 0 },
    lastCenter: { x: 0, y: 0 },
    touchStartTime: 0,
    touchStartCount: 0,
    hasMoved: false,
  });

  const getDistance = useCallback((touch1, touch2) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const getCenter = useCallback((touch1, touch2) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  }, []);

  const handleTouchStart = useCallback((e) => {
    const touchCount = e.touches.length;

    // Track touch start for tap detection
    touchStateRef.current.touchStartTime = Date.now();
    touchStateRef.current.touchStartCount = touchCount;
    touchStateRef.current.hasMoved = false;

    if (touchCount === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      touchStateRef.current = {
        ...touchStateRef.current,
        isMultiTouch: true,
        initialDistance: getDistance(touch1, touch2),
        initialCenter: getCenter(touch1, touch2),
        lastCenter: getCenter(touch1, touch2),
      };
    } else if (touchCount === 3) {
      e.preventDefault();
      touchStateRef.current.isMultiTouch = true;
    }
  }, [getDistance, getCenter]);

  const handleTouchMove = useCallback((e) => {
    // Mark that we've moved (not a tap)
    touchStateRef.current.hasMoved = true;

    if (e.touches.length === 2 && touchStateRef.current.isMultiTouch) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      // Handle pinch-to-zoom
      const currentDistance = getDistance(touch1, touch2);
      const { initialDistance } = touchStateRef.current;

      if (initialDistance > 0) {
        const scale = currentDistance / initialDistance;
        const zoomDelta = (scale - 1) * 0.5; // Reduce sensitivity

        if (Math.abs(zoomDelta) > 0.01 && onZoom) {
          onZoom(zoomDelta);
          touchStateRef.current.initialDistance = currentDistance;
        }
      }

      // Handle two-finger pan
      const currentCenter = getCenter(touch1, touch2);
      const { lastCenter } = touchStateRef.current;

      const panDelta = {
        x: currentCenter.x - lastCenter.x,
        y: currentCenter.y - lastCenter.y,
      };

      if ((Math.abs(panDelta.x) > 1 || Math.abs(panDelta.y) > 1) && onPan) {
        onPan(panDelta);
      }

      touchStateRef.current.lastCenter = currentCenter;
    }
  }, [getDistance, getCenter, onZoom, onPan]);

  const handleTouchEnd = useCallback((e) => {
    const { touchStartTime, touchStartCount, hasMoved } = touchStateRef.current;
    const touchDuration = Date.now() - touchStartTime;

    // Detect quick taps (< 300ms and no significant movement)
    if (!hasMoved && touchDuration < 300) {
      if (touchStartCount === 2 && e.touches.length === 0) {
        // Two-finger tap = undo
        onUndo?.();
      } else if (touchStartCount === 3 && e.touches.length === 0) {
        // Three-finger tap = redo
        onRedo?.();
      }
    }

    if (e.touches.length < 2) {
      touchStateRef.current.isMultiTouch = false;
    }
  }, [onUndo, onRedo]);

  useEffect(() => {
    const target = targetRef?.current;
    if (!target) return;

    // Use passive: false to allow preventDefault
    const options = { passive: false };

    target.addEventListener('touchstart', handleTouchStart, options);
    target.addEventListener('touchmove', handleTouchMove, options);
    target.addEventListener('touchend', handleTouchEnd);
    target.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      target.removeEventListener('touchstart', handleTouchStart);
      target.removeEventListener('touchmove', handleTouchMove);
      target.removeEventListener('touchend', handleTouchEnd);
      target.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [targetRef, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isMultiTouch: touchStateRef.current.isMultiTouch,
  };
}
