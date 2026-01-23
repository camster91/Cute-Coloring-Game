import { useRef, useCallback, useEffect } from 'react';

/**
 * Hook for handling touch gestures (pinch-to-zoom, two-finger pan)
 * @param {Object} options
 * @param {function} options.onZoom - Callback for zoom changes (delta)
 * @param {function} options.onPan - Callback for pan changes ({x, y})
 * @param {React.RefObject} options.targetRef - Ref to the target element
 */
export default function useTouchGestures({ onZoom, onPan, targetRef }) {
  const touchStateRef = useRef({
    isMultiTouch: false,
    initialDistance: 0,
    initialCenter: { x: 0, y: 0 },
    lastCenter: { x: 0, y: 0 },
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
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      touchStateRef.current = {
        isMultiTouch: true,
        initialDistance: getDistance(touch1, touch2),
        initialCenter: getCenter(touch1, touch2),
        lastCenter: getCenter(touch1, touch2),
      };
    }
  }, [getDistance, getCenter]);

  const handleTouchMove = useCallback((e) => {
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
    if (e.touches.length < 2) {
      touchStateRef.current.isMultiTouch = false;
    }
  }, []);

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
