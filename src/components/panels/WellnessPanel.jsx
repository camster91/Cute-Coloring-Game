import { Slider } from '../ui';

/**
 * Wellness panel for mindfulness features
 * Enhanced with better visual design
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
    border: darkMode ? 'border-gray-700/50' : 'border-gray-200/80',
    hover: darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100',
    active: darkMode
      ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/20 text-white'
      : 'bg-gradient-to-br from-indigo-100 to-purple-50 text-indigo-700',
    section: darkMode ? 'bg-gray-800/50' : 'bg-gray-50/80',
    sectionBorder: darkMode ? 'border-gray-700/30' : 'border-gray-200/50',
    input: darkMode
      ? 'bg-gray-700/50 border-gray-600/50 text-white'
      : 'bg-white border-gray-200 text-gray-900',
  };

  const Section = ({ title, children, action }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className={`text-[10px] font-semibold uppercase tracking-wider ${theme.textMuted}`}>
          {title}
        </h4>
        {action}
      </div>
      {children}
    </div>
  );

  const Toggle = ({ label, checked, onChange }) => (
    <label className={`
      flex items-center justify-between p-3 rounded-xl cursor-pointer
      ${theme.section} border ${theme.sectionBorder}
      transition-all duration-200 hover:shadow-sm
    `}>
      <span className={`text-xs font-medium ${theme.text}`}>{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className={`
          w-10 h-5 rounded-full transition-all duration-200
          ${checked
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
            : (darkMode ? 'bg-gray-600' : 'bg-gray-300')
          }
        `} />
        <div className={`
          absolute top-0.5 left-0.5 w-4 h-4 rounded-full
          bg-white shadow-sm transition-transform duration-200 ease-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `} />
      </div>
    </label>
  );

  return (
    <div className="space-y-5">
      {/* Session Timer */}
      <Section title="Session Timer">
        <div className={`p-4 rounded-xl ${theme.section} border ${theme.sectionBorder} text-center`}>
          <div className={`
            text-3xl font-mono font-bold tracking-tight
            ${theme.text}
            bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text
            ${darkMode ? 'text-transparent' : ''}
          `}>
            {formatTime(sessionSeconds)}
          </div>
          <p className={`text-xs ${theme.textMuted} mt-2`}>Time spent creating</p>
        </div>

        <Toggle
          label="Break reminder"
          checked={breakReminderEnabled}
          onChange={setBreakReminderEnabled}
        />

        {breakReminderEnabled && (
          <div className={`p-3 rounded-xl ${theme.section} border ${theme.sectionBorder}`}>
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
          </div>
        )}
      </Section>

      {/* Breathing Exercise */}
      <Section
        title="Breathing Exercise"
        action={
          <button
            onClick={() => setShowBreathing(!showBreathing)}
            className={`
              text-[10px] px-3 py-1 rounded-lg font-medium
              transition-all duration-200
              ${showBreathing
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm'
                : `${theme.hover} ${theme.textMuted}`
              }
            `}
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
          className={`
            w-full px-3 py-2 text-xs rounded-xl border
            ${theme.input} ${theme.sectionBorder}
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50
            transition-all duration-200 cursor-pointer
          `}
        >
          {breathingPatterns.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {showBreathing && (
          <div className={`p-4 rounded-xl ${theme.section} border ${theme.sectionBorder} text-center`}>
            <div
              className={`
                w-20 h-20 mx-auto rounded-full flex items-center justify-center
                transition-transform duration-1000 ease-in-out
                bg-gradient-to-br from-blue-400 to-indigo-500
                text-white text-lg font-medium capitalize shadow-lg
              `}
              style={{
                transform: `scale(${0.8 + breathingProgress * 0.4})`,
                boxShadow: `0 0 ${20 + breathingProgress * 20}px rgba(99, 102, 241, ${0.3 + breathingProgress * 0.3})`,
              }}
            >
              {breathingPhase.replace('1', '').replace('2', '')}
            </div>
            <div className="mt-4">
              <div className={`w-full rounded-full h-1.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="h-1.5 rounded-full transition-all duration-100 bg-gradient-to-r from-blue-400 to-indigo-500"
                  style={{ width: `${breathingProgress * 100}%` }}
                />
              </div>
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
            className={`
              text-[10px] px-2.5 py-1 rounded-md font-medium
              ${theme.hover} ${theme.textMuted}
              transition-all duration-200
              hover:scale-105 active:scale-95
            `}
          >
            New
          </button>
        }
      >
        {currentPrompt && (
          <div className={`
            p-4 rounded-xl ${theme.section} border ${theme.sectionBorder}
            relative overflow-hidden
          `}>
            <div className="absolute -right-4 -top-4 text-6xl opacity-10">
              {currentPrompt.icon}
            </div>
            <div className="flex items-start gap-3 relative">
              <span className="text-2xl">{currentPrompt.icon}</span>
              <div>
                <p className={`text-sm leading-relaxed ${theme.text}`}>
                  {currentPrompt.text}
                </p>
                <p className={`
                  text-[10px] uppercase tracking-wider mt-2
                  ${theme.textMuted}
                `}>
                  {currentPrompt.category}
                </p>
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* Ambient Sounds */}
      <Section title="Ambient Sounds">
        <div className={`p-3 rounded-xl ${theme.section} border ${theme.sectionBorder}`}>
          <Slider
            label="Master Volume"
            value={Math.round(masterVolume * 100)}
            min={0}
            max={100}
            onChange={(v) => setMasterVolume(v / 100)}
            unit="%"
            darkMode={darkMode}
          />
        </div>

        <div className={`grid grid-cols-4 gap-2 p-2 rounded-xl ${theme.section} border ${theme.sectionBorder}`}>
          {ambientSounds.map(sound => {
            const isActive = activeSounds[sound.id];
            return (
              <button
                key={sound.id}
                onClick={() => onToggleSound(sound.id)}
                className={`
                  p-2.5 rounded-xl text-xl transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md scale-105'
                    : `${theme.hover} hover:scale-105 active:scale-95`
                  }
                `}
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
          <div className={`rounded-xl overflow-hidden border ${theme.sectionBorder}`}>
            {musicTracks.map((track, index) => {
              const isPlayingTrack = isPlaying && currentTrack?.name === track.name;
              return (
                <button
                  key={track.name}
                  onClick={() => isPlayingTrack ? stopMusic() : playTrack(track)}
                  className={`
                    w-full px-3 py-2.5 text-xs text-left flex items-center gap-2
                    transition-all duration-200
                    ${index > 0 ? `border-t ${theme.sectionBorder}` : ''}
                    ${isPlayingTrack
                      ? 'bg-gradient-to-r from-green-400/20 to-emerald-400/20'
                      : `${theme.section} ${theme.hover}`
                    }
                  `}
                >
                  <span className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-[10px]
                    ${isPlayingTrack
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                      : (darkMode ? 'bg-gray-700' : 'bg-gray-200')
                    }
                  `}>
                    {isPlayingTrack ? '⏸' : '▶'}
                  </span>
                  <span className={`flex-1 ${theme.text}`}>{track.name}</span>
                  {isPlayingTrack && (
                    <span className="flex gap-0.5">
                      {[...Array(3)].map((_, i) => (
                        <span
                          key={i}
                          className="w-0.5 bg-green-400 rounded-full animate-pulse"
                          style={{
                            height: `${8 + Math.random() * 8}px`,
                            animationDelay: `${i * 0.15}s`,
                          }}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Section>
      )}
    </div>
  );
}
