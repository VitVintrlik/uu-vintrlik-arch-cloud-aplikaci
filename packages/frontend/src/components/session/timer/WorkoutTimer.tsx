import { cn } from '../../../utils/cn';
import { useElapsedTime } from '../../../hooks/domain/useElapsedTime';

type WorkoutTimerProps = {
  startTime: string;
  className?: string;
};

/** Animated elapsed-time display with a pulsing indicator dot, used in the session header. */
export const WorkoutTimer = ({ startTime, className }: WorkoutTimerProps) => {
  const time = useElapsedTime(startTime);

  return (
    <div className={cn('flex items-center gap-2 font-mono text-primary-fixed', className)}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-fixed"></span>
      </span>
      <span className="tabular-nums">{time}</span>
    </div>
  );
};
