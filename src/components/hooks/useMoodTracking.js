import { useState, useEffect, useCallback, useMemo } from 'react';

// Mood options with emojis and colors
export const moodOptions = [
  { id: 'amazing', emoji: '🌟', label: 'Amazing', color: '#FFD700', value: 5 },
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#4CAF50', value: 4 },
  { id: 'calm', emoji: '😌', label: 'Calm', color: '#64B5F6', value: 3.5 },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#9E9E9E', value: 3 },
  { id: 'tired', emoji: '😴', label: 'Tired', color: '#7E57C2', value: 2.5 },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: '#FF9800', value: 2 },
  { id: 'sad', emoji: '😢', label: 'Sad', color: '#5C6BC0', value: 1.5 },
  { id: 'stressed', emoji: '😤', label: 'Stressed', color: '#EF5350', value: 1 },
];

// Activity tags
export const activityTags = [
  { id: 'drawing', emoji: '🎨', label: 'Drawing' },
  { id: 'meditation', emoji: '🧘', label: 'Meditation' },
  { id: 'breathing', emoji: '🌬️', label: 'Breathing' },
  { id: 'nature', emoji: '🌿', label: 'Nature sounds' },
  { id: 'music', emoji: '🎵', label: 'Music' },
  { id: 'coloring', emoji: '🖍️', label: 'Coloring' },
  { id: 'mandala', emoji: '🔆', label: 'Mandala' },
  { id: 'free', emoji: '✏️', label: 'Free draw' },
];

/**
 * Hook for mood tracking with history
 */
export default function useMoodTracking() {
  // Current session mood
  const [currentMood, setCurrentMood] = useState(null);
  const [moodNote, setMoodNote] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);

  // Mood history (persisted)
  const [moodHistory, setMoodHistory] = useState(() => {
    const saved = localStorage.getItem('calmDrawing_moodHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Show mood prompt on session start
  const [showMoodPrompt, setShowMoodPrompt] = useState(true);
  const [showMoodHistory, setShowMoodHistory] = useState(false);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('calmDrawing_moodHistory', JSON.stringify(moodHistory));
  }, [moodHistory]);

  // Record mood entry
  const recordMood = useCallback((mood, note = '', activities = []) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      mood: mood.id,
      moodValue: mood.value,
      moodLabel: mood.label,
      moodEmoji: mood.emoji,
      moodColor: mood.color,
      note: note.trim(),
      activities,
      sessionType: 'start',
    };

    setMoodHistory(prev => [...prev, entry]);
    setCurrentMood(mood);
    setShowMoodPrompt(false);
    return entry;
  }, []);

  // Record end-of-session mood
  const recordEndMood = useCallback((mood, note = '', activities = []) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      mood: mood.id,
      moodValue: mood.value,
      moodLabel: mood.label,
      moodEmoji: mood.emoji,
      moodColor: mood.color,
      note: note.trim(),
      activities,
      sessionType: 'end',
    };

    setMoodHistory(prev => [...prev, entry]);
    return entry;
  }, []);

  // Toggle activity selection
  const toggleActivity = useCallback((activityId) => {
    setSelectedActivities(prev =>
      prev.includes(activityId)
        ? prev.filter(a => a !== activityId)
        : [...prev, activityId]
    );
  }, []);

  // Delete a mood entry
  const deleteMoodEntry = useCallback((entryId) => {
    setMoodHistory(prev => prev.filter(e => e.id !== entryId));
  }, []);

  // Clear all history
  const clearMoodHistory = useCallback(() => {
    setMoodHistory([]);
    localStorage.removeItem('calmDrawing_moodHistory');
  }, []);

  // Get mood statistics
  const moodStats = useMemo(() => {
    if (moodHistory.length === 0) return null;

    const last7Days = moodHistory.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    const last30Days = moodHistory.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return entryDate >= monthAgo;
    });

    const avgMood = (entries) => {
      if (entries.length === 0) return 0;
      return entries.reduce((sum, e) => sum + e.moodValue, 0) / entries.length;
    };

    const moodCounts = moodHistory.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    const mostCommonMood = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])[0];

    const activityCounts = moodHistory.reduce((acc, entry) => {
      entry.activities?.forEach(a => {
        acc[a] = (acc[a] || 0) + 1;
      });
      return acc;
    }, {});

    return {
      totalEntries: moodHistory.length,
      avgMoodWeek: avgMood(last7Days),
      avgMoodMonth: avgMood(last30Days),
      avgMoodAll: avgMood(moodHistory),
      mostCommonMood: mostCommonMood ? moodOptions.find(m => m.id === mostCommonMood[0]) : null,
      moodCounts,
      activityCounts,
      entriesThisWeek: last7Days.length,
      entriesThisMonth: last30Days.length,
    };
  }, [moodHistory]);

  // Get mood trend (last 7 entries)
  const moodTrend = useMemo(() => {
    return moodHistory
      .slice(-7)
      .map(entry => ({
        date: new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
        value: entry.moodValue,
        mood: entry.mood,
        emoji: entry.moodEmoji,
        color: entry.moodColor,
      }));
  }, [moodHistory]);

  // Group entries by date for history view
  const groupedHistory = useMemo(() => {
    const groups = {};
    moodHistory.forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
    });
    return Object.entries(groups)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
      .slice(0, 14); // Last 14 days
  }, [moodHistory]);

  // Dismiss mood prompt
  const dismissMoodPrompt = useCallback(() => {
    setShowMoodPrompt(false);
  }, []);

  // Reset for new session
  const startNewSession = useCallback(() => {
    setCurrentMood(null);
    setMoodNote('');
    setSelectedActivities([]);
    setShowMoodPrompt(true);
  }, []);

  return {
    // Current session
    currentMood,
    setCurrentMood,
    moodNote,
    setMoodNote,
    selectedActivities,
    setSelectedActivities,
    toggleActivity,

    // Mood prompts
    showMoodPrompt,
    setShowMoodPrompt,
    dismissMoodPrompt,

    // History view
    showMoodHistory,
    setShowMoodHistory,
    moodHistory,
    groupedHistory,

    // Actions
    recordMood,
    recordEndMood,
    deleteMoodEntry,
    clearMoodHistory,
    startNewSession,

    // Statistics
    moodStats,
    moodTrend,
  };
}
