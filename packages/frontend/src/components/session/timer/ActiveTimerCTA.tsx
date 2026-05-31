import { Link } from 'react-router-dom';

import { useElapsedTime } from '../../../hooks/domain/useElapsedTime';

type ActiveTimerCTAProps = {
  startTime: string;
  sessionId: string;
};

/** Dashboard call-to-action linking to the active session with a live elapsed time display. */
export const ActiveTimerCTA = ({ startTime, sessionId }: ActiveTimerCTAProps) => {
  const time = useElapsedTime(startTime);

  return (
    <Link
      to={`/session/${sessionId}`}
      className="block w-full bg-primary-fixed text-on-primary-fixed font-display font-black text-center py-4 rounded-xl shadow-[0_4px_20px_rgba(195,244,0,0.15)] hover:opacity-95 active:scale-[0.99] transition-all uppercase tracking-widest text-lg"
    >
      POKRAČOVAT V TRÉNINKU • {time}
    </Link>
  );
};
