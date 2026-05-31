import { useState, useMemo } from 'react';

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  type Table,
} from '@tanstack/react-table';

import { SessionStatus, type WorkoutSession } from 'shared';

import { columns } from '../../components/session/sessionList/columns';
import { useSessionsQuery } from '../api/useSessions';

type UseSessionListReturn = {
  table: Table<WorkoutSession>;
  isLoading: boolean;
  isEmpty: boolean;
};

export const useSessionList = (): UseSessionListReturn => {
  const { data: sessions, isLoading } = useSessionsQuery();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);

  const finishedSessions = useMemo(
    () => sessions?.filter((s) => s.status === SessionStatus.FINISHED) ?? [],
    [sessions],
  );

  const table = useReactTable({
    data: finishedSessions,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return { table, isLoading, isEmpty: !isLoading && finishedSessions.length === 0 };
};
