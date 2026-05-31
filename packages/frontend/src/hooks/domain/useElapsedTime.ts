import { useEffect, useState } from 'react';
import { formatElapsedTime } from '../../components/session/utils/timerUtils';

/** Drives a live elapsed-time string that ticks every second from the given ISO start time. Clears the interval on unmount. */
export const useElapsedTime = (startTime: string) => {
  const [time, setTime] = useState(() => formatElapsedTime(startTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatElapsedTime(startTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return time;
};
