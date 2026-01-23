import { Slider } from '../ui';

/**
 * Layers panel for managing drawing layers
 */
export default function LayersPanel({
  layers,
  activeLayerId,
  setActiveLayerId,
  onAddLayer,
  onDeleteLayer,
  onToggleVisibility,
  onToggleLock,
  onLayerOpacity,
  onMoveLayer,
  onDuplicateLayer,
  onMergeDown,
  // Theme
  darkMode = false,
}) {
  const theme = {
    text: darkMode ? 'text-gray-200' : 'text-gray-700',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    active: darkMode ? 'bg-indigo-900/50 border-indigo-500' : 'bg-indigo-50 border-indigo-500',
    section: darkMode ? 'bg-gray-700/50' : 'bg-gray-50',
  };

  const activeLayer = layers.find(l => l.id === activeLayerId);

  return (
    <div className="space-y-3">
      {/* Layer Actions */}
      <div className="flex gap-1">
        <button
          onClick={onAddLayer}
          className={`flex-1 px-2 py-1.5 text-xs rounded-lg ${theme.hover}`}
          title="Add Layer"
        >
          + Add
        </button>
        <button
          onClick={() => onDuplicateLayer(activeLayerId)}
          disabled={!activeLayerId}
          className={`flex-1 px-2 py-1.5 text-xs rounded-lg ${theme.hover} disabled:opacity-30`}
          title="Duplicate Layer"
        >
          ⧉ Dupe
        </button>
        <button
          onClick={() => onMergeDown(activeLayerId)}
          disabled={!activeLayerId || layers.length < 2}
          className={`flex-1 px-2 py-1.5 text-xs rounded-lg ${theme.hover} disabled:opacity-30`}
          title="Merge Down"
        >
          ⤵ Merge
        </button>
      </div>

      {/* Active Layer Opacity */}
      {activeLayer && (
        <Slider
          label={`Opacity: ${activeLayer.name}`}
          value={Math.round(activeLayer.opacity * 100)}
          min={0}
          max={100}
          onChange={(v) => onLayerOpacity(activeLayerId, v / 100)}
          unit="%"
          darkMode={darkMode}
        />
      )}

      {/* Layers List */}
      <div className={`rounded-lg border ${theme.border} overflow-hidden`}>
        {layers.slice().reverse().map((layer, index) => {
          const isActive = layer.id === activeLayerId;
          const actualIndex = layers.length - 1 - index;

          return (
            <div
              key={layer.id}
              onClick={() => setActiveLayerId(layer.id)}
              className={`
                flex items-center gap-2 px-2 py-2 cursor-pointer
                border-b last:border-b-0 ${theme.border}
                transition-colors
                ${isActive ? theme.active : theme.hover}
                ${isActive ? 'border-l-2' : 'border-l-2 border-l-transparent'}
              `}
            >
              {/* Visibility */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility(layer.id);
                }}
                className={`text-sm ${layer.visible ? '' : 'opacity-30'}`}
                title={layer.visible ? 'Hide layer' : 'Show layer'}
              >
                {layer.visible ? '👁' : '👁‍🗨'}
              </button>

              {/* Lock */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLock(layer.id);
                }}
                className={`text-sm ${layer.locked ? 'text-red-500' : 'opacity-50'}`}
                title={layer.locked ? 'Unlock layer' : 'Lock layer'}
              >
                {layer.locked ? '🔒' : '🔓'}
              </button>

              {/* Name */}
              <span className={`flex-1 text-xs truncate ${theme.text}`}>
                {layer.name}
              </span>

              {/* Move buttons */}
              <div className="flex gap-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayer(layer.id, 'up');
                  }}
                  disabled={actualIndex === layers.length - 1}
                  className="text-xs px-1 opacity-50 hover:opacity-100 disabled:opacity-20"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayer(layer.id, 'down');
                  }}
                  disabled={actualIndex === 0}
                  className="text-xs px-1 opacity-50 hover:opacity-100 disabled:opacity-20"
                  title="Move down"
                >
                  ↓
                </button>
              </div>

              {/* Delete */}
              {layers.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLayer(layer.id);
                  }}
                  className="text-xs px-1 text-red-500 opacity-50 hover:opacity-100"
                  title="Delete layer"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Layer count */}
      <p className={`text-xs ${theme.textMuted} text-center`}>
        {layers.length} layer{layers.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
