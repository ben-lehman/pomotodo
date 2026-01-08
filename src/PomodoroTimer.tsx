import { useEffect, useRef, useState } from "react";

interface usePomodoroTimerProps {
  durationMs: number;
  onComplete?: () => void;
}

const usePomodoroTimer = ({ durationMs, onComplete }: usePomodoroTimerProps) => {
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    startTimeRef.current = Date.now() - (durationMs - remainingMs);
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current!;
      const remaining = durationMs - elapsed;
      if (remaining <= 0) {
        setRemainingMs(0);
        setIsRunning(false);
        onComplete?.();
      } else {
        setRemainingMs(remaining);
      }
    }, 100); // Update every 100ms for smoother UI
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, durationMs, onComplete]);

  const start = () => setIsRunning(true)
  const pause = () => setIsRunning(false)
  const reset = () => {
    setIsRunning(false)
    setRemainingMs(durationMs)
  }

  return {
    isRunning,
    remainingMs,
    start,
    pause,
    reset
  }
}

export const PomodoroTimer = () => {
  const { remainingMs, isRunning, start, pause, reset } = usePomodoroTimer({
    durationMs: 25 * 60 * 1000,
    onComplete: () => console.log('Pomodoro complete!'),
  });
  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  return (
    <div>
      <div>{`${minutes}:${seconds.toString().padStart(2, '0')}`}</div>
      <button onClick={isRunning ? pause : start}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
