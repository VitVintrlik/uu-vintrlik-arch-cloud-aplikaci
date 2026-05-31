/** TanStack Query hooks and cache keys for the /sessions REST endpoints. */
import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';

import { WorkoutSplit, type WorkoutSession, type ExerciseEntry } from 'shared';

import { apiClient } from '../../api/client';

export type WorkoutSessionWithExercises = WorkoutSession & {
  exerciseEntries: ExerciseEntry[];
};

export const SESSION_KEYS = {
  all: ['sessions'] as const,
  detail: (id: string) => ['sessions', id] as const,
};

export const STATS_KEYS = {
  dashboard: ['dashboardStats'] as const,
};

/** Fetches the session list. Accepts a selector via options.select, used by domain hooks to derive subsets without extra network calls. */
export const useSessionsQuery = <TData = WorkoutSession[]>(
  options?: Omit<UseQueryOptions<WorkoutSession[], Error, TData>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery({
    queryKey: SESSION_KEYS.all,
    queryFn: async () => {
      const response = await apiClient<{ itemList: WorkoutSession[] }>('/sessions');
      return response.itemList;
    },
    ...options,
  });
};

/** Fetches a single session with its exercise entries. Disabled until a valid id is provided. */
export const useSessionDetailQuery = (id: string) => {
  return useQuery({
    queryKey: SESSION_KEYS.detail(id),
    queryFn: () => apiClient<WorkoutSessionWithExercises>(`/sessions/${id}`),
    enabled: !!id,
  });
};

/** Creates a new session and invalidates the session list and dashboard stats caches on success. */
export const useCreateSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; split: WorkoutSplit; note?: string }) =>
      apiClient<WorkoutSession>('/sessions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: SESSION_KEYS.all }),
        queryClient.invalidateQueries({ queryKey: STATS_KEYS.dashboard }),
      ]);
    },
  });
};

/** Patches a session to FINISHED status and invalidates all related caches on success. */
export const useFinishSessionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      apiClient<WorkoutSession>(`/sessions/${id}/finish`, {
        method: 'PATCH',
        body: JSON.stringify({ note }),
      }),
    onSuccess: (data) => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: SESSION_KEYS.all }),
        queryClient.invalidateQueries({ queryKey: SESSION_KEYS.detail(data.id) }),
        queryClient.invalidateQueries({ queryKey: STATS_KEYS.dashboard }),
      ]);
    },
  });
};
