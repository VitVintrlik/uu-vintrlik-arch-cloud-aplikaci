import { type ColumnDef, type CellContext } from '@tanstack/react-table';

import { type WorkoutSession } from 'shared';

import { formatShortDate, formatDuration, formatSplit } from '../../../utils/formatters';

export type ColumnMeta = {
  headerClassName?: string;
  cellClassName?: string;
};

export const columns: ColumnDef<WorkoutSession, string>[] = [
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
