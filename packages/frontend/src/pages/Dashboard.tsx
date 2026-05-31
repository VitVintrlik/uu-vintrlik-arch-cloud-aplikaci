import { Dumbbell, History, Medal, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@uu/kinetic-ui';

import { SessionActivityItem } from '../components/session/dashboard/SessionActivityItem';
import { StatCard } from '../components/session/dashboard/StatCard';
import { ActiveTimerCTA } from '../components/session/timer/ActiveTimerCTA';
import { CreateSessionModal } from '../components/session/createSession/CreateSessionModal';
import { Skeleton } from '../components/ui/Skeleton';
import { useDashboard } from '../hooks/domain/useDashboard';

/** Landing page showing active session state, latest PR, aggregate workout stats, and recent session history. */
const Dashboard = () => {
  const navigate = useNavigate();
  const {
    activeSession,
    isActiveLoading,
    stats,
    isStatsLoading,
    lastPR,
    isPRLoading,
    finishedSessions,
    isSessionsLoading,
    isModalOpen,
    openModal,
    closeModal,
  } = useDashboard();

  return (
    <div className="w-full max-w-[900px] mx-auto flex flex-col gap-8 pb-24 font-sans">
      <section className="flex flex-col gap-2">
        {isActiveLoading ? (
          <Skeleton className="h-16 w-full rounded-xl" />
        ) : activeSession ? (
          <ActiveTimerCTA startTime={activeSession.startTime} sessionId={activeSession.id} />
        ) : (
          <Button
            onClick={openModal}
            variant="primary"
            className="w-full rounded-xl h-16 gap-3 hover:bg-primary-dim transition-colors"
          >
            <PlusCircle size={24} />
            <span className="text-lg font-black uppercase tracking-widest">Začít trénink</span>
          </Button>
        )}
      </section>

      <section className="grid grid-cols-2 gap-4">
        {isStatsLoading || isPRLoading ? (
          <>
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              title="Poslední milník (Bench · Deadlift · Squat)"
              value={lastPR ? `${lastPR.weight} kg` : '0'}
              bgIcon={<Medal size={48} />}
              footerIcon={<Medal size={12} />}
              footerLabel={lastPR ? `${lastPR.exerciseName} +${lastPR.delta} kg` : 'Žádný nový PR'}
              footerClassName={lastPR ? 'text-primary-fixed' : 'text-on-surface-variant opacity-60'}
            />
            <StatCard
              title="Tréninky"
              value={stats?.workoutCount || 0}
              bgIcon={<Dumbbell size={48} />}
              footerIcon={<Dumbbell size={12} />}
              footerLabel="Celkem odcvičeno"
              footerClassName="text-on-surface-variant opacity-60"
            />
          </>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="border-b border-white/5 pb-3">
          <h2 className="text-lg font-black text-white font-sans uppercase tracking-tight flex items-center gap-2">
            <History className="text-primary-fixed" size={20} />
            Aktivita
          </h2>
        </div>

        {isSessionsLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        ) : finishedSessions.length === 0 ? (
          <div className="p-10 text-center bg-surface-container-high rounded-xl border border-white/5 text-on-surface-variant font-medium text-sm">
            Zatím žádné záznamy. Tvůj první trénink čeká.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {finishedSessions.map((s) => (
              <SessionActivityItem
                key={s.id}
                session={s}
                onClick={() => navigate(`/session/${s.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      <CreateSessionModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Dashboard;
