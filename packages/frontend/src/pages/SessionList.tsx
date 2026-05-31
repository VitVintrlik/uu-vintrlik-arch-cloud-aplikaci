import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { flexRender } from '@tanstack/react-table';

import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@uu/kinetic-ui';

import { type ColumnMeta } from '../components/session/sessionList/columns';
import { Skeleton } from '../components/ui/Skeleton';
import { useSessionList } from '../hooks/domain/useSessionList';

/** Sortable table of all finished sessions. */
const SessionList = () => {
  const { table, isLoading, isEmpty } = useSessionList();
  const navigate = useNavigate();

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

  if (isEmpty) {
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
                  return (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={`py-3 px-4 tracking-widest font-bold text-primary-fixed ${meta.headerClassName ?? ''} ${
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
                  return (
                    <TableCell key={cell.id} className={`py-4 px-4 ${meta.cellClassName ?? ''}`}>
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
