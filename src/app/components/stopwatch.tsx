import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
      <h3 className="mb-4 dark:text-white">Rest Timer</h3>
      <div className="text-4xl font-mono text-center mb-4 dark:text-white">
        {formatTime(time)}
      </div>
      <div className="flex gap-2 justify-center">
        <Button onClick={handleStartPause} variant="default">
          {isRunning ? (
            <>
              <Pause className="size-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="size-4 mr-2" />
              Start
            </>
          )}
        </Button>
        <Button onClick={handleReset} variant="outline">
          <RotateCcw className="size-4 mr-2" />
          Reset
        </Button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
        Rest 30-60 seconds between sets in the "W" sequence
      </p>
    </div>
  );
}