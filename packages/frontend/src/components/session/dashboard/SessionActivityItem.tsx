import {
  Dumbbell,
  ChevronRight,
  Flame,
  Zap,
  Trophy,
  User,
  ArrowLeftRight,
  Swords,
} from 'lucide-react';

import { Badge } from '@uu/kinetic-ui';
import { WorkoutSplit, type WorkoutSession } from 'shared';

import { formatSessionDate, formatDuration, formatSplit } from '../../../utils/formatters';

const SPLIT_ICONS: Record<string, React.ReactNode> = {
  [WorkoutSplit.FULL_BODY]: <Flame size={20} />,
  [WorkoutSplit.UPPER_LOWER]: <Zap size={20} />,
  [WorkoutSplit.PPL]: <Dumbbell size={20} />,
  [WorkoutSplit.PUSH_PULL]: <ArrowLeftRight size={20} />,
  [WorkoutSplit.BRO_SPLIT]: <User size={20} />,
  [WorkoutSplit.TORSO_LIMB]: <Swords size={20} />,
  [WorkoutSplit.ARNOLD]: <Trophy size={20} />,
};

type SessionActivityItemProps = {
  session: WorkoutSession;
  onClick: () => void;
};

export const SessionActivityItem = ({ session, onClick }: SessionActivityItemProps) => (
  <div
    className="bg-surface-container-low rounded-xl p-5 border border-white/5 flex items-center justify-between hover:border-primary-fixed/20 hover:bg-surface-container transition-all cursor-pointer group"
    onClick={onClick}
  >
    <div className="flex items-center gap-5">
      <div className="w-11 h-11 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-fixed group-hover:scale-105 transition-transform">
        {SPLIT_ICONS[session.split] ?? <Dumbbell size={20} />}
      </div>
      <div>
        <h4 className="text-lg font-bold text-white group-hover:text-primary-fixed transition-colors leading-tight">
          {session.name}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
            {formatSessionDate(session.date)}
          </p>
          <Badge className="text-[8px] px-1.5 py-0.5">{formatSplit(session.split)}</Badge>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-6">
      <div className="flex flex-col items-end">
        <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5 opacity-40">
          Doba
        </span>
        <Badge>{formatDuration(session.duration)}</Badge>
      </div>
      <ChevronRight
        size={16}
        className="text-white/10 group-hover:text-primary-fixed group-hover:translate-x-1 transition-all"
      />
    </div>
  </div>
);
