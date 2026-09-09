"use client";

import { useCallback, useEffect, useState } from "react";
import { audioEngine } from "./audioEngine";

export function useSound() {
  const [isMuted, setIsMuted] = useState<boolean>(true);

  useEffect(() => {
    setIsMuted(audioEngine.getMuted());
  }, []);

  const toggleSound = useCallback(() => {
    const nextState = audioEngine.toggleMute();
    setIsMuted(nextState);
    return !nextState;
  }, []);

  const playClick = useCallback((freq?: number) => {
    audioEngine.playClick(freq);
  }, []);

  const playPing = useCallback((freq?: number, duration?: number) => {
    audioEngine.playPing(freq, duration);
  }, []);

  const playSuccess = useCallback(() => {
    audioEngine.playSuccess();
  }, []);

  const playPulse = useCallback(() => {
    audioEngine.playPulse();
  }, []);

  return {
    isMuted,
    toggleSound,
    playClick,
    playPing,
    playSuccess,
    playPulse,
  };
}
