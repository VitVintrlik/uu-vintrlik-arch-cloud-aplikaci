import { useState } from 'react';

import {
  PlusCircle,
  Dumbbell,
  History,
  ChevronRight,
  Flame,
  Zap,
  Trophy,
  User,
  ArrowLeftRight,
  Swords,
  Medal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Badge, Button, Card } from '@uu/kinetic-ui';
import { SessionStatus, WorkoutSplit } from 'shared';

import { ActiveTimerCTA } from '../components/session/timer/ActiveTimerCTA';
import { CreateSessionModal } from '../components/session/createSession/CreateSessionModal';
import { Skeleton } from '../components/ui/Skeleton';
import { useSessionsQuery } from '../hooks/api/useSessions';
import { useActiveSession } from '../hooks/domain/useActiveSession';
import { useDashboardStats } from '../hooks/domain/useDashboardStats';
import { useLastPR } from '../hooks/domain/useLastPR';
import { formatSessionDate, formatDuration, formatSplit } from '../utils/formatters';

type StatCardProps = {
  title: string;
  value: string | number;
  unit?: string;
  footerIcon: React.ReactNode;
  footerLabel: string;
  footerClassName?: string;
  bgIcon: React.ReactNode;
};

const StatCard = ({
  title,
  value,
  unit,
  footerIcon,
  footerLabel,
  footerClassName,
  bgIcon,
}: StatCardProps) => (
  <Card className="bg-surface-container-high rounded-xl p-6 border-white/5 flex flex-col justify-between relative overflow-hidden group h-32">
    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
      {bgIcon}
    </div>
    <Card.Header className="border-b-0 pb-0 mb-0">
      <Card.Title className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] relative z-10 font-sans">
        {title}
      </Card.Title>
    </Card.Header>
    <Card.Content className="relative z-10 flex items-baseline gap-1 mt-auto">
      <span className="text-4xl font-black text-white tracking-tighter font-sans">{value}</span>
      {unit && <span className="text-lg font-bold text-primary-fixed font-sans">{unit}</span>}
    </Card.Content>
    <Card.Footer
      className={`mt-2 pt-0 border-t-0 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest ${footerClassName}`}
    >
      {footerIcon}
      <span>{footerLabel}</span>
    </Card.Footer>
  </Card>
);

const SPLIT_ICONS: Record<string, React.ReactNode> = {
  [WorkoutSplit.FULL_BODY]: <Flame size={20} />,
  [WorkoutSplit.UPPER_LOWER]: <Zap size={20} />,
  [WorkoutSplit.PPL]: <Dumbbell size={20} />,
  [WorkoutSplit.PUSH_PULL]: <ArrowLeftRight size={20} />,
  [WorkoutSplit.BRO_SPLIT]: <User size={20} />,
  [WorkoutSplit.TORSO_LIMB]: <Swords size={20} />,
  [WorkoutSplit.ARNOLD]: <Trophy size={20} />,
};

/** Landing page showing active session state, latest PR, aggregate workout stats, and recent session history. */
const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  const { data: stats, isLoading: isStatsLoading } = useDashboardStats();
  const { lastPR, isLoading: isPRLoading } = useLastPR();
  const { activeSession, isLoading: isActiveLoading } = useActiveSession();
  const { data: sessions, isLoading: isSessionsLoading } = useSessionsQuery();

  const finishedSessions = sessions?.filter((s) => s.status === SessionStatus.FINISHED) || [];

  return (
    <div className="w-full max-w-[900px] mx-auto flex flex-col gap-8 pb-24 font-sans">
      <section className="flex flex-col gap-2">
        {isActiveLoading ? (
          <Skeleton className="h-16 w-full rounded-xl" />
        ) : activeSession ? (
          <ActiveTimerCTA startTime={activeSession.startTime} sessionId={activeSession.id} />
        ) : (
          <Button
            onClick={() => setModalOpen(true)}
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
              <div
                key={s.id}
                className="bg-surface-container-low rounded-xl p-5 border border-white/5 flex items-center justify-between hover:border-primary-fixed/20 hover:bg-surface-container transition-all cursor-pointer group"
                onClick={() => navigate(`/session/${s.id}`)}
              >
                <div className="flex items-center gap-5">
                  <div className="w-11 h-11 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-fixed group-hover:scale-105 transition-transform">
                    {SPLIT_ICONS[s.split] ?? <Dumbbell size={20} />}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-primary-fixed transition-colors leading-tight">
                      {s.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
                        {formatSessionDate(s.date)}
                      </p>
                      <Badge className="text-[8px] px-1.5 py-0.5">{formatSplit(s.split)}</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5 opacity-40">
                      Doba
                    </span>
                    <Badge>{formatDuration(s.duration)}</Badge>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-white/10 group-hover:text-primary-fixed group-hover:translate-x-1 transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <CreateSessionModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
