import { useState, useMemo } from 'react';

import { SessionStatus, type WorkoutSession } from 'shared';

import { useSessionsQuery } from '../api/useSessions';
import { useActiveSession } from './useActiveSession';
import { useDashboardStats } from './useDashboardStats';
import { useLastPR } from './useLastPR';

type DashboardStats = { workoutCount: number; totalVolume: number };
type LastPR = { exerciseName: string; weight: number; delta: number } | null;

type UseDashboardReturn = {
  activeSession: WorkoutSession | null;
  isActiveLoading: boolean;
  stats: DashboardStats | undefined;
  isStatsLoading: boolean;
  lastPR: LastPR;
  isPRLoading: boolean;
  finishedSessions: WorkoutSession[];
  isSessionsLoading: boolean;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useDashboard = (): UseDashboardReturn => {
  const [isModalOpen, setModalOpen] = useState(false);

  const { data: stats, isLoading: isStatsLoading } = useDashboardStats();
  const { lastPR, isLoading: isPRLoading } = useLastPR();
  const { activeSession, isLoading: isActiveLoading } = useActiveSession();
  const { data: sessions, isLoading: isSessionsLoading } = useSessionsQuery();

  const finishedSessions = useMemo(
    () => sessions?.filter((s) => s.status === SessionStatus.FINISHED) ?? [],
    [sessions],
  );

  return {
    activeSession: activeSession ?? null,
    isActiveLoading,
    stats,
    isStatsLoading,
    lastPR,
    isPRLoading,
    finishedSessions,
    isSessionsLoading,
    isModalOpen,
    openModal: () => setModalOpen(true),
    closeModal: () => setModalOpen(false),
  };
};
