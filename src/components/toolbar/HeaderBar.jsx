import { IconButton } from '../ui';

/**
 * Top navigation header bar
 */
export default function HeaderBar({
  // Branding
  title = 'Calm Drawing',
  // Template selection (legacy - not used anymore)
  drawings,
  currentDrawing,
  setCurrentDrawing,
  // Undo/Redo
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  // Zoom controls
  zoom,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onResetZoom,
  // Pan mode
  isPanning,
  onTogglePan,
  // Canvas size
  canvasSize,
  // Focus mode
  focusMode,
  setFocusMode,
  // Actions
  onExport,
  onImport,
  onToggleSounds,
  soundsActive,
  onToggleBreathing,
  breathingActive,
  onTogglePrompt,
  promptActive,
  // Session
  sessionTime,
  // Theme
  darkMode,
  setDarkMode,
  // Theme styles
  theme,
}) {
  return (
    <header className={`flex items-center justify-between px-3 py-2 ${theme.panel} border-b ${theme.border} shadow-sm`}>
      {/* Left: Logo + Canvas Info */}
      <div className="flex items-center gap-3">
        <h1 className={`text-lg font-bold ${theme.text}`}>
          🎨 {title}
        </h1>

        {/* Canvas size indicator */}
        {canvasSize && (
          <span className={`text-xs px-2 py-1 rounded ${theme.hover} ${theme.textMuted}`}>
            {canvasSize.width}×{canvasSize.height}
          </span>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Undo/Redo */}
        <IconButton
          icon="↩️"
          label="Undo"
          onClick={onUndo}
          disabled={!canUndo}
          darkMode={darkMode}
        />
        <IconButton
          icon="↪️"
          label="Redo"
          onClick={onRedo}
          disabled={!canRedo}
          darkMode={darkMode}
        />

        <div className={`w-px h-6 mx-1 ${theme.border}`} />

        {/* Zoom Controls */}
        <IconButton
          icon="−"
          label="Zoom Out"
          onClick={onZoomOut}
          size="sm"
          darkMode={darkMode}
        />
        <span className={`text-xs w-12 text-center ${theme.textMuted}`}>
          {Math.round(zoom * 100)}%
        </span>
        <IconButton
          icon="+"
          label="Zoom In"
          onClick={onZoomIn}
          size="sm"
          darkMode={darkMode}
        />
        <IconButton
          icon="⛶"
          label="Fit to Screen"
          onClick={onFitToScreen}
          size="sm"
          darkMode={darkMode}
        />
        <IconButton
          icon="1:1"
          label="Reset Zoom"
          onClick={onResetZoom}
          size="sm"
          darkMode={darkMode}
        />

        <div className={`w-px h-6 mx-1 ${theme.border}`} />

        {/* Session Timer */}
        <div className={`px-2 py-1 rounded-lg text-xs ${theme.hover}`}>
          ⏱️ {sessionTime}
        </div>

        {/* Wellness toggles */}
        <IconButton
          icon="🎵"
          label="Sounds"
          onClick={onToggleSounds}
          active={soundsActive}
          darkMode={darkMode}
        />
        <IconButton
          icon="🫁"
          label="Breathing Exercise"
          onClick={onToggleBreathing}
          active={breathingActive}
          darkMode={darkMode}
        />
        <IconButton
          icon="💡"
          label="Daily Prompt"
          onClick={onTogglePrompt}
          active={promptActive}
          darkMode={darkMode}
        />

        <div className={`w-px h-6 mx-1 ${theme.border}`} />

        {/* Import */}
        {onImport && (
          <IconButton
            icon="📂"
            label="Import Image"
            onClick={onImport}
            darkMode={darkMode}
          />
        )}

        {/* Export */}
        <IconButton
          icon="💾"
          label="Export"
          onClick={onExport}
          darkMode={darkMode}
        />

        {/* Pan Tool */}
        {onTogglePan && (
          <IconButton
            icon="✋"
            label="Pan Canvas (Space)"
            onClick={onTogglePan}
            active={isPanning}
            darkMode={darkMode}
          />
        )}

        {/* Theme toggle */}
        <IconButton
          icon={darkMode ? '☀️' : '🌙'}
          label={darkMode ? 'Light Mode' : 'Dark Mode'}
          onClick={() => setDarkMode(!darkMode)}
          darkMode={darkMode}
        />

        {/* Focus Mode */}
        <IconButton
          icon="🧘"
          label="Focus Mode (F)"
          onClick={() => setFocusMode(!focusMode)}
          active={focusMode}
          darkMode={darkMode}
        />
      </div>
    </header>
  );
}
