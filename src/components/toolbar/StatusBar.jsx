/**
 * Bottom status bar with contextual information
 */
export default function StatusBar({
  // Tool info
  activeTool,
  brushType,
  brushSize,
  shapeType,
  // Layer info
  activeLayer,
  layerCount,
  // Symmetry
  symmetryMode,
  // Canvas position
  cursorPosition,
  // History
  historyIndex,
  historyLength,
  // Focus mode shortcut
  focusModeShortcut = 'F',
  // Theme
  darkMode = false,
}) {
  const theme = {
    bg: darkMode ? 'bg-gray-800' : 'bg-gray-100',
    text: darkMode ? 'text-gray-300' : 'text-gray-600',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    muted: darkMode ? 'text-gray-500' : 'text-gray-400',
  };

  const StatusItem = ({ icon, children, title }) => (
    <div
      className={`flex items-center gap-1 px-2 py-0.5 text-xs ${theme.text}`}
      title={title}
    >
      {icon && <span>{icon}</span>}
      {children}
    </div>
  );

  const Divider = () => (
    <div className={`w-px h-4 ${theme.border} mx-1`} />
  );

  const getToolDisplay = () => {
    switch (activeTool) {
      case 'brush':
        return `${brushType?.icon || '🖌️'} ${brushType?.name || 'Brush'} (${brushSize}px)`;
      case 'eraser':
        return `🧽 Eraser (${brushSize}px)`;
      case 'fill':
        return '🪣 Fill Tool';
      case 'shape':
        return `${shapeType?.icon || '⬜'} ${shapeType?.name || 'Shape'}`;
      default:
        return activeTool;
    }
  };

  return (
    <footer className={`flex items-center justify-between px-2 py-1 ${theme.bg} border-t ${theme.border}`}>
      {/* Left: Tool info */}
      <div className="flex items-center">
        <StatusItem title="Current Tool">
          {getToolDisplay()}
        </StatusItem>

        {symmetryMode && symmetryMode.id !== 'none' && (
          <>
            <Divider />
            <StatusItem icon={symmetryMode.icon} title="Symmetry Mode">
              {symmetryMode.name}
            </StatusItem>
          </>
        )}
      </div>

      {/* Center: Layer info */}
      <div className="flex items-center">
        {activeLayer && (
          <StatusItem title="Active Layer">
            📑 {activeLayer.name} ({layerCount} layer{layerCount !== 1 ? 's' : ''})
          </StatusItem>
        )}

        {cursorPosition && (
          <>
            <Divider />
            <StatusItem title="Cursor Position">
              📍 {Math.round(cursorPosition.x)}, {Math.round(cursorPosition.y)}
            </StatusItem>
          </>
        )}
      </div>

      {/* Right: History + hints */}
      <div className="flex items-center">
        <StatusItem title="History">
          📜 {historyIndex + 1}/{historyLength}
        </StatusItem>

        <Divider />

        <StatusItem>
          <span className={theme.muted}>
            Press <kbd className="px-1 rounded bg-gray-200 dark:bg-gray-700 text-xs">{focusModeShortcut}</kbd> for Focus Mode
          </span>
        </StatusItem>
      </div>
    </footer>
  );
}
