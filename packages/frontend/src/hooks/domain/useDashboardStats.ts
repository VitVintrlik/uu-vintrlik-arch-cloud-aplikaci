import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../../api/client';
import { STATS_KEYS } from '../api/useSessions';

type DashboardStats = {
  workoutCount: number;
  totalVolume: number;
};

/** Fetches aggregated dashboard statistics (total workouts, total volume) from the dedicated stats endpoint. */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: STATS_KEYS.dashboard,
    queryFn: () => apiClient<DashboardStats>('/session/stats'),
  });
};
