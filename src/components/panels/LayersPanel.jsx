import { Slider } from '../ui';

/**
 * Layers panel for managing drawing layers
 * Enhanced with better visual design
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
    border: darkMode ? 'border-gray-700/50' : 'border-gray-200/80',
    hover: darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50',
    active: darkMode
      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/10 border-l-indigo-400'
      : 'bg-gradient-to-r from-indigo-50 to-purple-50/50 border-l-indigo-500',
    section: darkMode ? 'bg-gray-800/50' : 'bg-gray-50/80',
    sectionBorder: darkMode ? 'border-gray-700/30' : 'border-gray-200/50',
  };

  const activeLayer = layers.find(l => l.id === activeLayerId);

  const ActionButton = ({ children, onClick, disabled, title, variant = 'default' }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex-1 px-2 py-2 text-xs rounded-lg font-medium
        transition-all duration-200
        disabled:opacity-30 disabled:cursor-not-allowed
        ${variant === 'primary'
          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-md active:scale-95'
          : `${theme.section} ${theme.hover} border ${theme.sectionBorder}`
        }
      `}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Layer Actions */}
      <div className="flex gap-2">
        <ActionButton onClick={onAddLayer} title="Add Layer" variant="primary">
          + Add
        </ActionButton>
        <ActionButton
          onClick={() => onDuplicateLayer(activeLayerId)}
          disabled={!activeLayerId}
          title="Duplicate Layer"
        >
          Dupe
        </ActionButton>
        <ActionButton
          onClick={() => onMergeDown(activeLayerId)}
          disabled={!activeLayerId || layers.length < 2}
          title="Merge Down"
        >
          Merge
        </ActionButton>
      </div>

      {/* Active Layer Opacity */}
      {activeLayer && (
        <div className={`p-3 rounded-xl ${theme.section} border ${theme.sectionBorder}`}>
          <Slider
            label={`Opacity: ${activeLayer.name}`}
            value={Math.round(activeLayer.opacity * 100)}
            min={0}
            max={100}
            onChange={(v) => onLayerOpacity(activeLayerId, v / 100)}
            unit="%"
            darkMode={darkMode}
          />
        </div>
      )}

      {/* Layers List */}
      <div className={`rounded-xl border ${theme.sectionBorder} overflow-hidden`}>
        {layers.slice().reverse().map((layer, index) => {
          const isActive = layer.id === activeLayerId;
          const actualIndex = layers.length - 1 - index;

          return (
            <div
              key={layer.id}
              onClick={() => setActiveLayerId(layer.id)}
              className={`
                flex items-center gap-2 px-3 py-2.5 cursor-pointer
                transition-all duration-200
                border-l-2
                ${index > 0 ? `border-t ${theme.sectionBorder}` : ''}
                ${isActive
                  ? theme.active
                  : `${theme.section} ${theme.hover} border-l-transparent`
                }
              `}
            >
              {/* Visibility */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility(layer.id);
                }}
                className={`
                  w-6 h-6 rounded-md flex items-center justify-center
                  transition-all duration-200
                  ${layer.visible
                    ? (darkMode ? 'bg-gray-700' : 'bg-white shadow-sm')
                    : 'opacity-40'
                  }
                `}
                title={layer.visible ? 'Hide layer' : 'Show layer'}
              >
                <svg
                  className={`w-3.5 h-3.5 ${layer.visible ? theme.text : theme.textMuted}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {layer.visible ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  )}
                </svg>
              </button>

              {/* Lock */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLock(layer.id);
                }}
                className={`
                  w-6 h-6 rounded-md flex items-center justify-center
                  transition-all duration-200
                  ${layer.locked
                    ? 'bg-red-500/20 text-red-500'
                    : `${darkMode ? 'bg-gray-700' : 'bg-white shadow-sm'} opacity-50`
                  }
                `}
                title={layer.locked ? 'Unlock layer' : 'Lock layer'}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {layer.locked ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  )}
                </svg>
              </button>

              {/* Name */}
              <span className={`flex-1 text-xs font-medium truncate ${theme.text}`}>
                {layer.name}
              </span>

              {/* Opacity indicator */}
              <span className={`text-[10px] ${theme.textMuted}`}>
                {Math.round(layer.opacity * 100)}%
              </span>

              {/* Move buttons */}
              <div className="flex">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayer(layer.id, 'up');
                  }}
                  disabled={actualIndex === layers.length - 1}
                  className={`
                    w-5 h-5 rounded flex items-center justify-center
                    transition-all duration-200
                    ${theme.hover}
                    disabled:opacity-20
                  `}
                  title="Move up"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayer(layer.id, 'down');
                  }}
                  disabled={actualIndex === 0}
                  className={`
                    w-5 h-5 rounded flex items-center justify-center
                    transition-all duration-200
                    ${theme.hover}
                    disabled:opacity-20
                  `}
                  title="Move down"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Delete */}
              {layers.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLayer(layer.id);
                  }}
                  className={`
                    w-5 h-5 rounded flex items-center justify-center
                    text-red-400 opacity-50
                    hover:opacity-100 hover:bg-red-500/10
                    transition-all duration-200
                  `}
                  title="Delete layer"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Layer count */}
      <p className={`text-[10px] ${theme.textMuted} text-center`}>
        {layers.length} layer{layers.length !== 1 ? 's' : ''} • {activeLayer?.name || 'None selected'}
      </p>
    </div>
  );
}
