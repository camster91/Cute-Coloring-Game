import { Slider } from '../ui';

/**
 * Wellness panel for mindfulness features
 */
export default function WellnessPanel({
  // Session timer
  sessionSeconds,
  formatTime,
  breakInterval,
  setBreakInterval,
  breakReminderEnabled,
  setBreakReminderEnabled,
  onTakeBreak,
  // Breathing
  showBreathing,
  setShowBreathing,
  breathingPatterns,
  breathingPattern,
  setBreathingPattern,
  breathingPhase,
  breathingProgress,
  // Daily prompts
  showDailyPrompt,
  setShowDailyPrompt,
  currentPrompt,
  onNewPrompt,
  // Ambient sounds
  ambientSounds,
  activeSounds,
  onToggleSound,
  masterVolume,
  setMasterVolume,
  // Music
  musicTracks,
  isPlaying,
  currentTrack,
  playTrack,
  stopMusic,
  // Theme
  darkMode = false,
}) {
  const theme = {
    text: darkMode ? 'text-gray-200' : 'text-gray-700',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    active: darkMode ? 'bg-gray-700' : 'bg-indigo-100 text-indigo-700',
    section: darkMode ? 'bg-gray-700/50' : 'bg-gray-50',
    input: darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300',
  };

  const Section = ({ title, children, action }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h4 className={`text-xs font-semibold uppercase tracking-wide ${theme.textMuted}`}>
          {title}
        </h4>
        {action}
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Session Timer */}
      <Section title="Session Timer">
        <div className={`p-3 rounded-lg ${theme.section} text-center`}>
          <div className={`text-2xl font-mono ${theme.text}`}>
            {formatTime(sessionSeconds)}
          </div>
          <p className={`text-xs ${theme.textMuted} mt-1`}>Time drawing</p>
        </div>

        <div className="flex items-center justify-between">
          <label className={`text-xs ${theme.text}`}>Break reminder</label>
          <input
            type="checkbox"
            checked={breakReminderEnabled}
            onChange={(e) => setBreakReminderEnabled(e.target.checked)}
            className="w-4 h-4"
          />
        </div>

        {breakReminderEnabled && (
          <Slider
            label="Remind every"
            value={breakInterval}
            min={5}
            max={60}
            step={5}
            onChange={setBreakInterval}
            unit=" min"
            darkMode={darkMode}
          />
        )}
      </Section>

      {/* Breathing Exercise */}
      <Section
        title="Breathing Exercise"
        action={
          <button
            onClick={() => setShowBreathing(!showBreathing)}
            className={`text-xs px-2 py-0.5 rounded ${showBreathing ? theme.active : theme.hover}`}
          >
            {showBreathing ? 'Stop' : 'Start'}
          </button>
        }
      >
        <select
          value={breathingPattern?.id}
          onChange={(e) => {
            const pattern = breathingPatterns.find(p => p.id === e.target.value);
            if (pattern) setBreathingPattern(pattern);
          }}
          className={`w-full px-2 py-1.5 text-xs rounded border ${theme.input}`}
        >
          {breathingPatterns.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {showBreathing && (
          <div className={`p-3 rounded-lg ${theme.section} text-center`}>
            <div className={`text-lg font-medium capitalize ${theme.text}`}>
              {breathingPhase.replace('1', '').replace('2', '')}
            </div>
            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${breathingProgress * 100}%` }}
              />
            </div>
          </div>
        )}
      </Section>

      {/* Daily Prompt */}
      <Section
        title="Daily Prompt"
        action={
          <button
            onClick={onNewPrompt}
            className={`text-xs px-2 py-0.5 rounded ${theme.hover}`}
          >
            🔄 New
          </button>
        }
      >
        {currentPrompt && (
          <div className={`p-3 rounded-lg ${theme.section}`}>
            <span className="text-xl mr-2">{currentPrompt.icon}</span>
            <p className={`text-sm ${theme.text} mt-1`}>{currentPrompt.text}</p>
            <p className={`text-xs ${theme.textMuted} mt-1 capitalize`}>
              {currentPrompt.category}
            </p>
          </div>
        )}
      </Section>

      {/* Ambient Sounds */}
      <Section title="Ambient Sounds">
        <Slider
          label="Master Volume"
          value={Math.round(masterVolume * 100)}
          min={0}
          max={100}
          onChange={(v) => setMasterVolume(v / 100)}
          unit="%"
          darkMode={darkMode}
        />

        <div className="grid grid-cols-4 gap-1 mt-2">
          {ambientSounds.map(sound => {
            const isActive = activeSounds[sound.id];
            return (
              <button
                key={sound.id}
                onClick={() => onToggleSound(sound.id)}
                className={`p-2 rounded-lg text-lg transition-all ${
                  isActive ? 'bg-green-500 text-white' : theme.hover
                }`}
                title={sound.name}
              >
                {sound.emoji}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Background Music */}
      {musicTracks && (
        <Section title="Background Music">
          <div className="space-y-1">
            {musicTracks.map(track => (
              <button
                key={track.id}
                onClick={() => isPlaying && currentTrack === track.id ? stopMusic() : playTrack(track.id)}
                className={`w-full px-2 py-1.5 text-xs text-left rounded-lg transition-all ${
                  isPlaying && currentTrack === track.id ? 'bg-green-500 text-white' : theme.hover
                }`}
              >
                {isPlaying && currentTrack === track.id ? '⏸' : '▶'} {track.name}
              </button>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
