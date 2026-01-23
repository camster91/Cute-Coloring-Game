import React, { useState } from 'react';

/**
 * Mood Tracker Panel Component with History Visualization
 */
export default function MoodTracker({
  currentMood,
  moodNote,
  setMoodNote,
  selectedActivities,
  toggleActivity,
  showMoodPrompt,
  dismissMoodPrompt,
  showMoodHistory,
  setShowMoodHistory,
  groupedHistory,
  recordMood,
  deleteMoodEntry,
  clearMoodHistory,
  moodStats,
  moodTrend,
  moodOptions,
  activityTags,
  darkMode,
}) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleRecordMood = () => {
    if (selectedMood) {
      recordMood(selectedMood, moodNote, selectedActivities);
      setSelectedMood(null);
    }
  };

  // Mini mood chart component
  const MoodChart = ({ data }) => {
    if (!data || data.length === 0) return null;
    const maxValue = 5;
    const chartHeight = 60;

    return (
      <div className="flex items-end justify-between gap-1 h-16 px-2">
        {data.map((point, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <span className="text-lg">{point.emoji}</span>
            <div
              className="w-full rounded-t transition-all"
              style={{
                height: `${(point.value / maxValue) * chartHeight}px`,
                backgroundColor: point.color,
                opacity: 0.8,
              }}
            />
            <span className={`text-[10px] mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {point.date}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Stats display
  const StatsDisplay = () => {
    if (!moodStats || moodStats.totalEntries === 0) {
      return (
        <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No mood data yet. Start tracking to see insights.
        </div>
      );
    }

    const getMoodLabel = (value) => {
      if (value >= 4.5) return 'Amazing';
      if (value >= 3.5) return 'Good';
      if (value >= 2.5) return 'Okay';
      if (value >= 1.5) return 'Low';
      return 'Difficult';
    };

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="text-lg font-bold">{moodStats.entriesThisWeek}</div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>This Week</div>
          </div>
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="text-lg font-bold">{moodStats.avgMoodWeek.toFixed(1)}</div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg Mood</div>
          </div>
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="text-lg">{moodStats.mostCommonMood?.emoji || '—'}</div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Most Often</div>
          </div>
        </div>

        {moodTrend.length > 0 && (
          <div>
            <label className={`block text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Recent Mood Trend
            </label>
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <MoodChart data={moodTrend} />
            </div>
          </div>
        )}

        <div className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Overall feeling: <strong>{getMoodLabel(moodStats.avgMoodAll)}</strong> ({moodStats.totalEntries} entries)
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Current Mood Status */}
      {currentMood && (
        <div className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <span className="text-2xl">{currentMood.emoji}</span>
          <div>
            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Current Mood: {currentMood.label}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Session started
            </div>
          </div>
        </div>
      )}

      {/* Mood Recording Section */}
      {showMoodPrompt && !currentMood && (
        <div className={`p-4 rounded-lg border-2 border-dashed ${
          darkMode ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-gray-50'
        }`}>
          <div className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            How are you feeling right now?
          </div>

          {/* Mood Selection */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood)}
                className={`p-2 rounded-lg text-center transition-all ${
                  selectedMood?.id === mood.id
                    ? 'ring-2 ring-offset-2 ring-indigo-500 scale-105'
                    : ''
                } ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'}`}
                style={{
                  borderBottom: `3px solid ${mood.color}`,
                }}
              >
                <span className="text-xl">{mood.emoji}</span>
                <div className={`text-[10px] mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {mood.label}
                </div>
              </button>
            ))}
          </div>

          {/* Activity Tags */}
          {selectedMood && (
            <>
              <div className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                What will you be doing? (optional)
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {activityTags.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => toggleActivity(activity.id)}
                    className={`px-2 py-1 rounded-full text-xs transition-all ${
                      selectedActivities.includes(activity.id)
                        ? 'bg-indigo-500 text-white'
                        : darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {activity.emoji} {activity.label}
                  </button>
                ))}
              </div>

              {/* Note */}
              <textarea
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="Add a note (optional)..."
                rows={2}
                className={`w-full px-3 py-2 rounded-lg text-sm resize-none mb-3 ${
                  darkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                } border`}
              />

              {/* Record Button */}
              <button
                onClick={handleRecordMood}
                className="w-full py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
              >
                Start Session with {selectedMood.emoji}
              </button>
            </>
          )}

          <button
            onClick={dismissMoodPrompt}
            className={`w-full mt-2 py-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} hover:underline`}
          >
            Skip for now
          </button>
        </div>
      )}

      {/* Stats Section */}
      <div>
        <button
          onClick={() => setShowMoodHistory(!showMoodHistory)}
          className={`w-full flex items-center justify-between p-2 rounded-lg ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Mood Insights
          </span>
          <span className="text-lg">{showMoodHistory ? '▼' : '▶'}</span>
        </button>

        {showMoodHistory && (
          <div className="mt-3 space-y-4">
            <StatsDisplay />

            {/* History List */}
            {groupedHistory.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Recent History
                  </label>
                  {!showClearConfirm ? (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} hover:text-red-500`}
                    >
                      Clear All
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          clearMoodHistory();
                          setShowClearConfirm(false);
                        }}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {groupedHistory.map(([date, entries]) => (
                    <div key={date}>
                      <div className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {date}
                      </div>
                      {entries.map((entry) => (
                        <div
                          key={entry.id}
                          className={`flex items-center gap-2 p-2 rounded-lg mb-1 ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                        >
                          <span className="text-lg">{entry.moodEmoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {entry.moodLabel}
                              <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {entry.note && (
                              <div className={`text-[10px] truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {entry.note}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => deleteMoodEntry(entry.id)}
                            className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} hover:text-red-500`}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
