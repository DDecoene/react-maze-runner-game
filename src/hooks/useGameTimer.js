// src/hooks/useGameTimer.js
import { useState, useRef, useCallback } from 'react';

export function useGameTimer() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer(); // Clear previous before starting
    setElapsedTime(0); // Reset time display
    intervalRef.current = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000);
  }, [stopTimer]);

  const resetTimer = useCallback(() => {
      stopTimer();
      setElapsedTime(0);
  },[stopTimer]);

  return {
    elapsedTime,
    startTimer,
    stopTimer,
    resetTimer,
  };
}