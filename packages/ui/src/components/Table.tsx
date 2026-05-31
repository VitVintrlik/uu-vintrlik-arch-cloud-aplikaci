import * as React from 'react';
import { cn } from '../utils/cn';

/** Compound table primitive (Table, TableHeader, TableBody, TableRow, TableHead, TableCell) with hover rows and token-based styling. */
const Table = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLTableElement> & { ref?: React.Ref<HTMLTableElement> }) => (
  <div className="w-full overflow-auto">
    <table
      ref={ref}
      className={cn('w-full text-left border-collapse whitespace-nowrap', className)}
      {...props}
    />
  </div>
);

const TableHeader = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement> & {
  ref?: React.Ref<HTMLTableSectionElement>;
}) => (
  <thead
    ref={ref}
    className={cn('[&_tr]:border-b border-outline-variant/20', className)}
    {...props}
  />
);

const TableBody = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement> & {
  ref?: React.Ref<HTMLTableSectionElement>;
}) => <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />;

const TableRow = ({
  className,
  ref,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { ref?: React.Ref<HTMLTableRowElement> }) => (
  <tr
    ref={ref}
    className={cn('border-b border-outline-variant/10 transition-colors group', className)}
    {...props}
  />
);

const TableHead = ({
  className,
  ref,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & { ref?: React.Ref<HTMLTableCellElement> }) => (
  <th
    ref={ref}
    className={cn(
      'pb-4 font-mono text-label-sm text-on-surface-variant uppercase tracking-widest select-none align-middle font-medium',
      className,
    )}
    {...props}
  />
);

const TableCell = ({
  className,
  ref,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & { ref?: React.Ref<HTMLTableCellElement> }) => (
  <td
    ref={ref}
    className={cn(
      'py-4 pr-6 font-sans text-body-md text-on-surface group-hover:text-primary-fixed transition-colors align-middle',
      className,
    )}
    {...props}
  />
);

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
