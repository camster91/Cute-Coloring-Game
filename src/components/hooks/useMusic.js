import { useRef, useState, useCallback } from 'react';

/**
 * Hook for background music playback using Web Audio API
 */
export default function useMusic() {
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const intervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  const melodies = {
    lullaby: [261.63, 293.66, 329.63, 293.66, 261.63, 293.66, 329.63, 349.23, 329.63, 293.66, 261.63],
    cheerful: [392, 440, 494, 523, 494, 440, 392, 440, 494, 523, 587, 523],
    calm: [196, 220, 247, 262, 247, 220, 196, 220, 247, 262],
    playful: [523, 587, 659, 698, 659, 587, 523, 587, 659, 784, 659, 587],
    peaceful: [220, 262, 294, 330, 294, 262, 220, 262, 294, 330],
    nature: [440, 494, 523, 587, 659, 587, 523, 494, 440, 523, 587, 659],
  };

  const playTrack = useCallback((track) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (oscillatorRef.current) try { oscillatorRef.current.stop(); } catch(e) {}
    if (audioContextRef.current) try { audioContextRef.current.close(); } catch(e) {}

    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);
    gainNodeRef.current.gain.value = 0.12;

    const melody = melodies[track.type];
    let noteIndex = 0;

    const playNote = () => {
      if (oscillatorRef.current) try { oscillatorRef.current.stop(); } catch(e) {}
      oscillatorRef.current = audioContextRef.current.createOscillator();
      oscillatorRef.current.type = 'sine';
      oscillatorRef.current.frequency.value = melody[noteIndex % melody.length];
      oscillatorRef.current.connect(gainNodeRef.current);
      oscillatorRef.current.start();
      oscillatorRef.current.stop(audioContextRef.current.currentTime + 0.35);
      noteIndex++;
    };

    playNote();
    intervalRef.current = setInterval(playNote, 450);
    setIsPlaying(true);
    setCurrentTrack(track);
  }, []);

  const stopMusic = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (oscillatorRef.current) try { oscillatorRef.current.stop(); } catch(e) {}
    if (audioContextRef.current) try { audioContextRef.current.close(); } catch(e) {}
    setIsPlaying(false);
    setCurrentTrack(null);
  }, []);

  return { isPlaying, currentTrack, playTrack, stopMusic };
}
