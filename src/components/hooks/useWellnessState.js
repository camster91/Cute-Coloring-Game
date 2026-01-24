import { useState, useEffect, useCallback } from 'react';

// Breathing patterns for relaxation
export const breathingPatterns = [
  { id: 'box', name: 'Box Breathing', inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  { id: '478', name: '4-7-8 Relaxing', inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  { id: 'calm', name: 'Calming', inhale: 4, hold1: 2, exhale: 6, hold2: 2 },
  { id: 'energize', name: 'Energizing', inhale: 4, hold1: 0, exhale: 4, hold2: 0 },
];

// Daily drawing prompts for inspiration
export const dailyPrompts = [
  // Emotion & Abstract
  { text: "Draw how you feel right now", category: "emotion", icon: "💭" },
  { text: "Visualize your dreams from last night", category: "abstract", icon: "🌙" },
  { text: "What does peace look like to you?", category: "emotion", icon: "☮️" },
  { text: "Draw your happy place", category: "memory", icon: "😊" },
  { text: "Illustrate a song you love", category: "abstract", icon: "🎵" },
  { text: "What color is your mood today?", category: "emotion", icon: "🎨" },
  { text: "Draw energy and movement", category: "abstract", icon: "⚡" },
  { text: "Visualize calm waters", category: "mindful", icon: "🌊" },
  { text: "Create patterns that soothe you", category: "mindful", icon: "🔮" },
  { text: "Draw what gratitude feels like", category: "emotion", icon: "🙏" },
  // Nature
  { text: "A tree in different seasons", category: "nature", icon: "🌳" },
  { text: "Your favorite flower in detail", category: "nature", icon: "🌸" },
  { text: "A sunset you remember", category: "nature", icon: "🌅" },
  { text: "Mountains touching clouds", category: "nature", icon: "🏔️" },
  { text: "Ocean waves crashing", category: "nature", icon: "🌊" },
  { text: "A garden at midnight", category: "nature", icon: "🌙" },
  { text: "Rain on a window", category: "nature", icon: "🌧️" },
  { text: "Autumn leaves falling", category: "nature", icon: "🍂" },
  { text: "A bird in flight", category: "nature", icon: "🦅" },
  { text: "Moonlight on water", category: "nature", icon: "🌕" },
  // Memory & Personal
  { text: "Your childhood bedroom", category: "memory", icon: "🛏️" },
  { text: "A meal that brings comfort", category: "memory", icon: "🍲" },
  { text: "Someone who inspires you", category: "memory", icon: "✨" },
  { text: "A place you want to visit", category: "memory", icon: "✈️" },
  { text: "Your morning routine", category: "memory", icon: "☀️" },
  { text: "A gift you treasure", category: "memory", icon: "🎁" },
  { text: "Your favorite season", category: "memory", icon: "🗓️" },
  { text: "A book that changed you", category: "memory", icon: "📚" },
  // Challenge
  { text: "Draw using only circles", category: "challenge", icon: "⭕" },
  { text: "Create with just 3 colors", category: "challenge", icon: "🎨" },
  { text: "Draw without lifting your pen", category: "challenge", icon: "✏️" },
  { text: "Fill the page with tiny patterns", category: "challenge", icon: "🔲" },
  { text: "Draw the same thing 9 ways", category: "challenge", icon: "9️⃣" },
  { text: "Use only straight lines", category: "challenge", icon: "📏" },
  { text: "Create a symmetrical design", category: "challenge", icon: "🔄" },
  { text: "Draw with your non-dominant hand", category: "challenge", icon: "🤚" },
  // Mindful
  { text: "Slow, deliberate spiral", category: "mindful", icon: "🌀" },
  { text: "Meditative repeated shapes", category: "mindful", icon: "🔷" },
  { text: "Breath-synchronized strokes", category: "mindful", icon: "🫁" },
  { text: "Zentangle-inspired patterns", category: "mindful", icon: "✴️" },
  { text: "Mandala from the center out", category: "mindful", icon: "🔆" },
  { text: "Flowing water-like lines", category: "mindful", icon: "〰️" },
  { text: "Gentle gradients of color", category: "mindful", icon: "🌈" },
  { text: "Repetitive calming marks", category: "mindful", icon: "|||" },
  // Creative
  { text: "A door to another world", category: "creative", icon: "🚪" },
  { text: "What lives in the clouds?", category: "creative", icon: "☁️" },
  { text: "An impossible architecture", category: "creative", icon: "🏛️" },
  { text: "Merge two animals into one", category: "creative", icon: "🦄" },
  { text: "A map of an imaginary place", category: "creative", icon: "🗺️" },
  { text: "Objects with personalities", category: "creative", icon: "🎭" },
  { text: "Time as a visual concept", category: "creative", icon: "⏰" },
  { text: "Music as shapes and colors", category: "creative", icon: "🎼" },
];

// Ambient soundscapes for relaxation
export const ambientSounds = [
  { id: 'rain', name: 'Rain', emoji: '🌧️', category: 'nature' },
  { id: 'thunder', name: 'Thunderstorm', emoji: '⛈️', category: 'nature' },
  { id: 'ocean', name: 'Ocean Waves', emoji: '🌊', category: 'nature' },
  { id: 'forest', name: 'Forest', emoji: '🌲', category: 'nature' },
  { id: 'birds', name: 'Birds', emoji: '🐦', category: 'nature' },
  { id: 'wind', name: 'Wind', emoji: '💨', category: 'nature' },
  { id: 'fire', name: 'Fireplace', emoji: '🔥', category: 'cozy' },
  { id: 'cafe', name: 'Coffee Shop', emoji: '☕', category: 'ambient' },
  { id: 'white', name: 'White Noise', emoji: '📻', category: 'focus' },
  { id: 'brown', name: 'Brown Noise', emoji: '🟤', category: 'focus' },
  { id: 'creek', name: 'Creek', emoji: '🏞️', category: 'nature' },
  { id: 'night', name: 'Night Crickets', emoji: '🦗', category: 'nature' },
];

// Format time as HH:MM:SS or MM:SS
export const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

/**
 * Hook for managing wellness features state
 */
export default function useWellnessState() {
  // Session Timer
  const [sessionStartTime] = useState(Date.now());
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const [breakInterval, setBreakInterval] = useState(25); // minutes
  const [breakReminderEnabled, setBreakReminderEnabled] = useState(true);
  const [lastBreakTime, setLastBreakTime] = useState(Date.now());

  // Breathing Exercise
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingPattern, setBreathingPattern] = useState(breathingPatterns[0]);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingProgress, setBreathingProgress] = useState(0);

  // Ambient Sound Mixer
  const [activeSounds, setActiveSounds] = useState({});
  const [masterVolume, setMasterVolume] = useState(0.7);

  // Daily Prompts
  const [showDailyPrompt, setShowDailyPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    return dailyPrompts[dayOfYear % dailyPrompts.length];
  });
  const [promptDismissed, setPromptDismissed] = useState(false);

  // Session timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionSeconds(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  // Break reminder effect
  useEffect(() => {
    if (!breakReminderEnabled) return;
    const timeSinceBreak = Date.now() - lastBreakTime;
    if (timeSinceBreak >= breakInterval * 60 * 1000) {
      setShowBreakReminder(true);
    }
  }, [sessionSeconds, breakInterval, breakReminderEnabled, lastBreakTime]);

  // Breathing exercise effect
  useEffect(() => {
    if (!showBreathing) return;

    const pattern = breathingPattern;
    const phases = [
      { name: 'inhale', duration: pattern.inhale },
      { name: 'hold', duration: pattern.hold1 },
      { name: 'exhale', duration: pattern.exhale },
      { name: 'hold', duration: pattern.hold2 },
    ].filter(p => p.duration > 0);

    let phaseIndex = 0;
    let progress = 0;

    const interval = setInterval(() => {
      progress += 0.1;
      const currentPhase = phases[phaseIndex];

      if (progress >= currentPhase.duration) {
        progress = 0;
        phaseIndex = (phaseIndex + 1) % phases.length;
      }

      setBreathingPhase(phases[phaseIndex].name);
      setBreathingProgress((progress / phases[phaseIndex].duration) * 100);
    }, 100);

    return () => clearInterval(interval);
  }, [showBreathing, breathingPattern]);

  // Actions
  const takeBreak = useCallback(() => {
    setShowBreakReminder(false);
    setLastBreakTime(Date.now());
  }, []);

  const dismissBreakReminder = useCallback(() => {
    setShowBreakReminder(false);
  }, []);

  const getNewPrompt = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * dailyPrompts.length);
    setCurrentPrompt(dailyPrompts[randomIndex]);
    setPromptDismissed(false);
  }, []);

  const toggleSound = useCallback((soundId) => {
    setActiveSounds(prev => {
      const newSounds = { ...prev };
      if (newSounds[soundId]) {
        delete newSounds[soundId];
      } else {
        newSounds[soundId] = masterVolume;
      }
      return newSounds;
    });
  }, [masterVolume]);

  const setSoundVolume = useCallback((soundId, volume) => {
    setActiveSounds(prev => ({
      ...prev,
      [soundId]: volume,
    }));
  }, []);

  return {
    // Session Timer
    sessionSeconds,
    sessionStartTime,
    formattedSessionTime: formatTime(sessionSeconds),

    // Break Reminder
    showBreakReminder,
    setShowBreakReminder,
    breakInterval,
    setBreakInterval,
    breakReminderEnabled,
    setBreakReminderEnabled,
    takeBreak,
    dismissBreakReminder,

    // Breathing
    showBreathing,
    setShowBreathing,
    breathingPattern,
    setBreathingPattern,
    breathingPhase,
    breathingProgress,

    // Sounds
    activeSounds,
    setActiveSounds,
    masterVolume,
    setMasterVolume,
    toggleSound,
    setSoundVolume,

    // Daily Prompts
    showDailyPrompt,
    setShowDailyPrompt,
    currentPrompt,
    setCurrentPrompt,
    promptDismissed,
    setPromptDismissed,
    getNewPrompt,

    // Constants
    breathingPatterns,
    dailyPrompts,
    ambientSounds,
    formatTime,
  };
}
