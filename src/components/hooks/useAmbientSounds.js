import { useRef, useCallback } from 'react';

/**
 * Hook for procedural ambient sound generation using Web Audio API
 */
export default function useAmbientSounds() {
  const audioContextRef = useRef(null);
  const nodesRef = useRef({});

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Create noise buffer
  const createNoiseBuffer = useCallback((type = 'white') => {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'brown') {
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        data[i] = lastOut * 3.5;
      } else if (type === 'pink') {
        data[i] = white * 0.5;
      } else {
        data[i] = white;
      }
    }
    return buffer;
  }, [getAudioContext]);

  // Stop a sound
  const stopSound = useCallback((soundId) => {
    if (nodesRef.current[soundId]) {
      try {
        nodesRef.current[soundId].source.stop();
        nodesRef.current[soundId].gain.disconnect();
      } catch (e) {}
      delete nodesRef.current[soundId];
    }
    if (nodesRef.current[soundId + '_lfo']) {
      try {
        nodesRef.current[soundId + '_lfo'].stop();
      } catch (e) {}
      delete nodesRef.current[soundId + '_lfo'];
    }
  }, []);

  // Start a sound
  const startSound = useCallback((soundId, volume = 0.5) => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    if (nodesRef.current[soundId]) {
      stopSound(soundId);
    }

    const gainNode = ctx.createGain();
    gainNode.gain.value = volume * 0.3;
    gainNode.connect(ctx.destination);

    let sourceNode;

    switch (soundId) {
      case 'white':
      case 'brown': {
        const buffer = createNoiseBuffer(soundId);
        sourceNode = ctx.createBufferSource();
        sourceNode.buffer = buffer;
        sourceNode.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = soundId === 'brown' ? 500 : 8000;
        sourceNode.connect(filter);
        filter.connect(gainNode);
        break;
      }
      case 'rain': {
        const buffer = createNoiseBuffer('white');
        sourceNode = ctx.createBufferSource();
        sourceNode.buffer = buffer;
        sourceNode.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3000;
        filter.Q.value = 0.5;

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.2;
        lfoGain.gain.value = 500;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        sourceNode.connect(filter);
        filter.connect(gainNode);
        nodesRef.current[soundId + '_lfo'] = lfo;
        break;
      }
      case 'ocean': {
        const buffer = createNoiseBuffer('brown');
        sourceNode = ctx.createBufferSource();
        sourceNode.buffer = buffer;
        sourceNode.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.08;
        lfoGain.gain.value = 0.3;
        lfo.connect(lfoGain);
        lfoGain.connect(gainNode.gain);
        lfo.start();

        sourceNode.connect(filter);
        filter.connect(gainNode);
        nodesRef.current[soundId + '_lfo'] = lfo;
        break;
      }
      case 'wind': {
        const buffer = createNoiseBuffer('white');
        sourceNode = ctx.createBufferSource();
        sourceNode.buffer = buffer;
        sourceNode.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        filter.Q.value = 2;

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.1;
        lfoGain.gain.value = 400;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        sourceNode.connect(filter);
        filter.connect(gainNode);
        nodesRef.current[soundId + '_lfo'] = lfo;
        break;
      }
      case 'fire': {
        const buffer = createNoiseBuffer('brown');
        sourceNode = ctx.createBufferSource();
        sourceNode.buffer = buffer;
        sourceNode.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 200;
        filter.Q.value = 1;

        const lfo = ctx.createOscillator();
        lfo.type = 'square';
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 4;
        lfoGain.gain.value = 0.2;
        lfo.connect(lfoGain);
        lfoGain.connect(gainNode.gain);
        lfo.start();

        sourceNode.connect(filter);
        filter.connect(gainNode);
        nodesRef.current[soundId + '_lfo'] = lfo;
        break;
      }
      case 'forest':
      case 'birds':
      case 'night':
      case 'creek':
      case 'thunder':
      case 'cafe': {
        const buffer = createNoiseBuffer(soundId === 'thunder' ? 'brown' : 'white');
        sourceNode = ctx.createBufferSource();
        sourceNode.buffer = buffer;
        sourceNode.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        const freqMap = {
          forest: 2000, birds: 4000, night: 3000,
          creek: 5000, thunder: 100, cafe: 2500
        };
        filter.frequency.value = freqMap[soundId] || 2000;
        filter.Q.value = soundId === 'thunder' ? 0.5 : 1;

        sourceNode.connect(filter);
        filter.connect(gainNode);
        break;
      }
      default: {
        const buffer = createNoiseBuffer('white');
        sourceNode = ctx.createBufferSource();
        sourceNode.buffer = buffer;
        sourceNode.loop = true;
        sourceNode.connect(gainNode);
      }
    }

    sourceNode.start();
    nodesRef.current[soundId] = { source: sourceNode, gain: gainNode };
  }, [getAudioContext, createNoiseBuffer, stopSound]);

  // Update volume
  const setVolume = useCallback((soundId, volume) => {
    if (nodesRef.current[soundId]) {
      nodesRef.current[soundId].gain.gain.value = volume * 0.3;
    }
  }, []);

  // Stop all sounds
  const stopAllSounds = useCallback(() => {
    Object.keys(nodesRef.current).forEach(id => {
      if (!id.endsWith('_lfo')) stopSound(id);
    });
  }, [stopSound]);

  return { startSound, stopSound, setVolume, stopAllSounds };
}
