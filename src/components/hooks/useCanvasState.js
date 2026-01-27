import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing canvas state (zoom, pan, grid)
 */
export default function useCanvasState() {
  // Zoom with localStorage persistence
  const [zoom, setZoom] = useState(() => {
    try {
      const saved = localStorage.getItem('calmDrawing_zoom');
      if (saved) return parseFloat(saved);
    } catch (e) {
      console.warn('Failed to load zoom:', e);
    }
    return 1;
  });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hasInitializedZoom, setHasInitializedZoom] = useState(false);

  // Grid settings
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20);
  const [snapToGrid, setSnapToGrid] = useState(false);

  // Window size for responsive layout
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });

  // Persist zoom to localStorage
  useEffect(() => {
    try { localStorage.setItem('calmDrawing_zoom', zoom.toString()); } catch (e) {}
  }, [zoom]);

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Zoom controls
  const zoomIn = useCallback(() => {
    setZoom(z => Math.min(4, z + 0.25));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(z => Math.max(0.25, z - 0.25));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const fitToScreen = useCallback((canvasWidth, canvasHeight, containerWidth, containerHeight) => {
    const scaleX = containerWidth / canvasWidth;
    const scaleY = containerHeight / canvasHeight;
    const newZoom = Math.min(scaleX, scaleY, 1) * 0.9;
    setZoom(newZoom);
    setPan({ x: 0, y: 0 });
    setHasInitializedZoom(true);
  }, []);

  // Snap point to grid if enabled
  const snapPointToGrid = useCallback((point) => {
    if (!snapToGrid) return point;
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize,
    };
  }, [snapToGrid, gridSize]);

  // Responsive breakpoints
  const isMobile = windowSize.width < 640;
  const isTablet = windowSize.width >= 640 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  return {
    // Zoom
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen,
    hasInitializedZoom,
    setHasInitializedZoom,

    // Pan
    pan,
    setPan,

    // Grid
    showGrid,
    setShowGrid,
    gridSize,
    setGridSize,
    snapToGrid,
    setSnapToGrid,
    snapPointToGrid,

    // Window size and breakpoints
    windowSize,
    setWindowSize,
    isMobile,
    isTablet,
    isDesktop,
  };
}
