/** TanStack Query hooks and cache keys for the /exercises REST endpoints. */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { ExerciseEntry } from 'shared';

import { apiClient } from '../../api/client';
import { SESSION_KEYS } from './useSessions';

export const EXERCISE_KEYS = {
  all: ['exercises'] as const,
};

/** Fetches all exercise entries across all sessions. */
export const useAllExercisesQuery = () => {
  return useQuery({
    queryKey: EXERCISE_KEYS.all,
    queryFn: async () => {
      const response = await apiClient<{ itemList: ExerciseEntry[] }>('/exercises');
      return response.itemList;
    },
  });
};

/** Adds an exercise entry to a session and invalidates the session detail and exercise list caches. */
export const useAddExerciseMutation = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<ExerciseEntry, 'id' | 'workoutSessionId'>) =>
      apiClient<ExerciseEntry>(`/sessions/${sessionId}/exercises`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: SESSION_KEYS.detail(sessionId) }),
        queryClient.invalidateQueries({ queryKey: EXERCISE_KEYS.all }),
      ]);
    },
  });
};

/** Updates an existing exercise entry and invalidates the parent session detail and exercise list caches. */
export const useUpdateExerciseMutation = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<ExerciseEntry> & { id: string }) =>
      apiClient<ExerciseEntry>(`/exercises/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: SESSION_KEYS.detail(sessionId) }),
        queryClient.invalidateQueries({ queryKey: EXERCISE_KEYS.all }),
      ]);
    },
  });
};

/** Deletes an exercise entry and invalidates the parent session detail and exercise list caches. */
export const useDeleteExerciseMutation = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/exercises/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: SESSION_KEYS.detail(sessionId) }),
        queryClient.invalidateQueries({ queryKey: EXERCISE_KEYS.all }),
      ]);
    },
  });
};
