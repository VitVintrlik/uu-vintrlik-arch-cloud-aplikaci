import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { Heading, Button } from '@uu/kinetic-ui';
import { SessionStatus } from 'shared';

import { WorkoutTimer } from './timer/WorkoutTimer';
import { formatShortDate, formatSplit } from '../../utils/formatters';
import { useSessionDetailQuery } from '../../hooks/api/useSessions';

type SessionHeaderProps = {
  onFinish: () => void;
};

/** Page header for a workout session showing its name, split, date, live timer, and the finish action. */
export const SessionHeader = ({ onFinish }: SessionHeaderProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: session } = useSessionDetailQuery(id ?? '');

  if (!session) return null;

  const { name, date, split, status, startTime, duration } = session;
  const isActive = status === SessionStatus.ACTIVE;

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-label-sm text-on-surface-variant hover:text-on-surface uppercase tracking-wider transition-colors"
      >
        <ChevronLeft size={16} />
        Zpět
      </button>
      <div className="flex justify-between items-end border-b border-outline-variant/10 pb-6">
        <div className="space-y-1">
          <Heading className="text-headline-lg">{name}</Heading>
          <div className="flex items-center gap-3 text-label-sm text-on-surface-variant uppercase tracking-wider">
            <span>{formatSplit(split)}</span>
            <span>•</span>
            <span>{formatShortDate(date)}</span>
            {isActive ? (
              <>
                <span>•</span>
                <WorkoutTimer startTime={startTime} />
              </>
            ) : duration ? (
              <>
                <span>•</span>
                <span>{duration} min</span>
              </>
            ) : null}
          </div>
        </div>
        {isActive && (
          <Button
            variant="primary"
            size="md"
            onClick={onFinish}
            className="hover:bg-primary-dim font-bold"
          >
            UKONČIT TRÉNINK
          </Button>
        )}
      </div>
    </div>
  );
};
