import { useState, useCallback } from 'react';

/**
 * Hook for managing layer state
 */
export default function useLayerState() {
  const [layers, setLayers] = useState([
    { id: 'layer-1', name: 'Layer 1', visible: true, locked: false, opacity: 1, paths: [] }
  ]);
  const [activeLayerId, setActiveLayerId] = useState('layer-1');
  const [draggedLayerId, setDraggedLayerId] = useState(null);

  // Get active layer
  const activeLayer = layers.find(l => l.id === activeLayerId) || layers[0];

  // Add a new layer
  const addLayer = useCallback(() => {
    const newId = `layer-${Date.now()}`;
    const newLayer = {
      id: newId,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      locked: false,
      opacity: 1,
      paths: [],
    };
    setLayers(prev => [...prev, newLayer]);
    setActiveLayerId(newId);
    return newId;
  }, [layers.length]);

  // Delete a layer
  const deleteLayer = useCallback((layerId) => {
    if (layers.length <= 1) return; // Don't delete last layer
    setLayers(prev => prev.filter(l => l.id !== layerId));
    if (activeLayerId === layerId) {
      setActiveLayerId(layers[0].id === layerId ? layers[1]?.id : layers[0].id);
    }
  }, [layers, activeLayerId]);

  // Duplicate a layer
  const duplicateLayer = useCallback((layerId) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    const newId = `layer-${Date.now()}`;
    const newLayer = {
      ...layer,
      id: newId,
      name: `${layer.name} Copy`,
      paths: [...layer.paths],
    };
    const index = layers.findIndex(l => l.id === layerId);
    setLayers(prev => [
      ...prev.slice(0, index + 1),
      newLayer,
      ...prev.slice(index + 1),
    ]);
    setActiveLayerId(newId);
    return newId;
  }, [layers]);

  // Merge layer down
  const mergeLayerDown = useCallback((layerId) => {
    const index = layers.findIndex(l => l.id === layerId);
    if (index <= 0) return; // Can't merge first layer

    const currentLayer = layers[index];
    const belowLayer = layers[index - 1];

    setLayers(prev => {
      const newLayers = [...prev];
      newLayers[index - 1] = {
        ...belowLayer,
        paths: [...belowLayer.paths, ...currentLayer.paths],
      };
      return newLayers.filter(l => l.id !== layerId);
    });
    setActiveLayerId(belowLayer.id);
  }, [layers]);

  // Toggle layer visibility
  const toggleLayerVisibility = useCallback((layerId) => {
    setLayers(prev => prev.map(l =>
      l.id === layerId ? { ...l, visible: !l.visible } : l
    ));
  }, []);

  // Toggle layer lock
  const toggleLayerLock = useCallback((layerId) => {
    setLayers(prev => prev.map(l =>
      l.id === layerId ? { ...l, locked: !l.locked } : l
    ));
  }, []);

  // Update layer opacity
  const setLayerOpacity = useCallback((layerId, opacity) => {
    setLayers(prev => prev.map(l =>
      l.id === layerId ? { ...l, opacity } : l
    ));
  }, []);

  // Rename layer
  const renameLayer = useCallback((layerId, name) => {
    setLayers(prev => prev.map(l =>
      l.id === layerId ? { ...l, name } : l
    ));
  }, []);

  // Reorder layers (move layer to new index)
  const reorderLayers = useCallback((fromIndex, toIndex) => {
    setLayers(prev => {
      const newLayers = [...prev];
      const [removed] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, removed);
      return newLayers;
    });
  }, []);

  // Add path to active layer
  const addPathToLayer = useCallback((path, layerId = activeLayerId) => {
    setLayers(prev => prev.map(l =>
      l.id === layerId ? { ...l, paths: [...l.paths, path] } : l
    ));
  }, [activeLayerId]);

  // Update paths in layer
  const updateLayerPaths = useCallback((layerId, paths) => {
    setLayers(prev => prev.map(l =>
      l.id === layerId ? { ...l, paths } : l
    ));
  }, []);

  // Clear layer
  const clearLayer = useCallback((layerId) => {
    setLayers(prev => prev.map(l =>
      l.id === layerId ? { ...l, paths: [] } : l
    ));
  }, []);

  // Clear all layers
  const clearAllLayers = useCallback(() => {
    setLayers(prev => prev.map(l => ({ ...l, paths: [] })));
  }, []);

  return {
    layers,
    setLayers,
    activeLayerId,
    setActiveLayerId,
    activeLayer,
    draggedLayerId,
    setDraggedLayerId,

    // Layer actions
    addLayer,
    deleteLayer,
    duplicateLayer,
    mergeLayerDown,
    toggleLayerVisibility,
    toggleLayerLock,
    setLayerOpacity,
    renameLayer,
    reorderLayers,

    // Path actions
    addPathToLayer,
    updateLayerPaths,
    clearLayer,
    clearAllLayers,
  };
}
