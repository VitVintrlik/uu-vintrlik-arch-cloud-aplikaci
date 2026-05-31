import { useState, useMemo } from 'react';

import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
  type CellContext,
} from '@tanstack/react-table';

import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@uu/kinetic-ui';
import { SessionStatus, type WorkoutSession } from 'shared';

import { Skeleton } from '../components/ui/Skeleton';
import { useSessionsQuery } from '../hooks/api/useSessions';
import { formatShortDate, formatDuration, formatSplit } from '../utils/formatters';

type ColumnMeta = {
  headerClassName?: string;
  cellClassName?: string;
};

const columns: ColumnDef<WorkoutSession, string>[] = [
  {
    accessorKey: 'date',
    header: 'Datum',
    meta: {
      headerClassName: 'w-[15%] pl-6',
      cellClassName: 'w-[15%] pl-6 font-mono text-base text-on-surface',
    } satisfies ColumnMeta,
    cell: (info: CellContext<WorkoutSession, string>) => formatShortDate(info.getValue()),
  },
  {
    accessorKey: 'name',
    header: 'Název',
    meta: {
      headerClassName: 'w-[35%]',
      cellClassName: 'w-[35%] text-base text-on-surface',
    } satisfies ColumnMeta,
  },
  {
    accessorKey: 'split',
    header: 'Split',
    meta: {
      headerClassName: 'w-[15%]',
      cellClassName: 'w-[15%] text-base text-on-surface font-mono',
    } satisfies ColumnMeta,
    cell: (info: CellContext<WorkoutSession, string>) => formatSplit(info.getValue()),
  },
  {
    accessorKey: 'duration',
    header: 'Doba',
    meta: {
      headerClassName: 'w-[15%]',
      cellClassName: 'w-[15%] text-base text-on-surface font-mono',
    } satisfies ColumnMeta,
    cell: (info: CellContext<WorkoutSession, string>) =>
      formatDuration(info.getValue() as unknown as number),
  },
  {
    accessorKey: 'note',
    header: 'Poznámka',
    enableSorting: false,
    meta: {
      headerClassName: 'w-[20%] pr-6',
      cellClassName: 'w-[20%] pr-6 text-base text-on-surface-variant',
    } satisfies ColumnMeta,
    cell: (info: CellContext<WorkoutSession, string>) => (
      <span className="truncate max-w-[240px] block">{info.getValue() || '—'}</span>
    ),
  },
];

/** Sortable table of all finished sessions. */
const SessionList = () => {
  const { data: sessions, isLoading } = useSessionsQuery();
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);
  const navigate = useNavigate();

  // 2. Filter for finished sessions
  const finishedSessions = useMemo(() => {
    if (!sessions) return [];
    return sessions.filter((s) => s.status === SessionStatus.FINISHED);
  }, [sessions]);

  // 3. Initialize TanStack Table
  const table = useReactTable({
    data: finishedSessions,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // 4. Loading State
  if (isLoading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto pb-24 font-sans">
        <h1 className="font-display text-3xl font-bold text-white mb-8 tracking-tight uppercase">
          Historie
        </h1>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-full h-16 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  // 5. Empty State
  if (finishedSessions.length === 0) {
    return (
      <div className="w-full max-w-[1200px] mx-auto pb-24 font-sans">
        <h1 className="font-display text-3xl font-bold text-white mb-8 tracking-tight uppercase">
          Historie
        </h1>
        <div className="text-center p-12 bg-surface-container-low rounded-xl border border-white/5 text-on-surface-variant font-medium">
          Zatím žádná historie. Běž cvičit!
        </div>
      </div>
    );
  }

  // 6. Table Render
  return (
    <div className="w-full max-w-[1200px] mx-auto pb-24 font-sans">
      <h1 className="font-display text-3xl font-bold text-white mb-8 tracking-tight uppercase">
        Historie
      </h1>

      <Card className="p-0 overflow-hidden border-outline-variant/10">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-b border-white/10"
              >
                {headerGroup.headers.map((header) => {
                  const meta = (header.column.columnDef.meta as ColumnMeta) || {};
                  const metaClass = meta.headerClassName || '';
                  return (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={`py-3 px-4 tracking-widest font-bold text-primary-fixed ${metaClass} ${
                        header.column.getCanSort()
                          ? 'cursor-pointer hover:text-white transition-colors'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="w-3.5 h-3.5 flex items-center justify-center">
                            {{
                              asc: <ChevronUp size={12} className="text-primary-fixed" />,
                              desc: <ChevronDown size={12} className="text-primary-fixed" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <ChevronsUpDown size={12} className="opacity-50" />
                            )}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => navigate(`/session/${row.original.id}`)}
                className="cursor-pointer border-b border-outline-variant/5 hover:bg-white/[0.03] group"
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = (cell.column.columnDef.meta as ColumnMeta) || {};
                  const metaClass = meta.cellClassName || '';
                  return (
                    <TableCell key={cell.id} className={`py-4 px-4 ${metaClass}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default SessionList;
